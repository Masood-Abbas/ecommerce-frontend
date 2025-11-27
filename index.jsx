import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  User,
  Flag,
  Target,
  Tag,
  Send,
  X,
  CalendarDays,
  Wifi,
  WifiOff,
  Save,
  Users,
  MessageSquare,
  Hash,
  ChevronDown,
  Play,
  Square,
  Timer,
  ImageIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "./UserAvatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { UITicket } from "@/utils/ticketTransformers";
import { useTaskThread } from "@/hooks/useTaskThread";
import { threadApi, ThreadMessage as ThreadMessageType } from "@/services/threadApi";
import { ThreadMessage } from "./ThreadMessage";
import { useEmployees } from "@/hooks/useEmployees";
import { extractAssigneeNames } from "@/utils/assigneeUtils";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { API_CONFIG } from "@/config/settings";
// Removed individual timer - now using global timer

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: UITicket | null;
  onSave: (updatedTicket: UITicket | FormData) => Promise<any> | void;
}

export function TaskDetailsModal({ isOpen, onClose, ticket, onSave }: TaskDetailsModalProps) {
  const [editedTicket, setEditedTicket] = useState<UITicket | null>(null);
  const [description, setDescription] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ThreadMessageType[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageQueueRef = useRef<any[]>([]);
  const isProcessingRef = useRef(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { data: employees = [] } = useEmployees();

  // Image upload states
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  // Use tabbed layout for mobile and tablet (below 1024px)
  const [isCompactView, setIsCompactView] = useState(false);

  // Image preview modal states
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    const checkSize = () => {
      setIsCompactView(window.innerWidth < 1024);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Add WebSocket context for message notifications
  const { sendTaskNotification } = useWebSocketContext();

  // Individual timers removed - now using global timer in header

  const getAssigneeNames = (
    assignedTo: string | { id: number; username: string }[] | { id: number }[] | undefined | null,
  ) => {
    return extractAssigneeNames(assignedTo);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800";
      case "Testing":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800";
      case "Done":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-700";
    }
  };

  const normalizePriority = (priority: string) => {
    if (!priority) return "Low";
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  };

  // Enhanced scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && !hasUserScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [shouldAutoScroll, hasUserScrolled]);

  // Handle scroll events to detect user interaction
  const handleScroll = useCallback((event: any) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;

    // If user scrolls up, mark as user scrolled
    if (!isAtBottom) {
      setHasUserScrolled(true);
      setShouldAutoScroll(false);
    } else {
      // If user scrolls back to bottom, re-enable auto scroll
      setHasUserScrolled(false);
      setShouldAutoScroll(true);
    }
  }, []);

  // Process queued messages
  const processMessageQueue = useCallback(() => {
    if (isProcessingRef.current || messageQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;

    // Process all queued messages at once
    const queuedMessages = [...messageQueueRef.current];
    messageQueueRef.current = [];

    queuedMessages.forEach((messageData) => {
      if (messageData.message && messageData.username) {
        const tempMessage: ThreadMessageType = {
          id: Date.now() + Math.random(), // Ensure unique ID for frontend
          message: messageData.message,
          created_by: messageData.username,
          updated_by: messageData.username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          task_id:
            messageData.thread_id ||
            (ticket?.id ? (typeof ticket.id === "string" ? parseInt(ticket.id, 10) : ticket.id) : 0), // Use thread_id from WebSocket
          thread_id: messageData.thread_id, // Store the thread_id from WebSocket
          replies: [],
          status: "Active",
          is_deleted: false,
          creation_time: new Date().toISOString(),
        };

        // Add message using functional update to avoid race conditions
        setMessages((prevMessages) => {
          // Check if message already exists to avoid duplicates
          const exists = prevMessages.some(
            (msg) =>
              msg.message === tempMessage.message &&
              msg.created_by === tempMessage.created_by &&
              Math.abs(new Date(msg.created_at).getTime() - new Date(tempMessage.created_at).getTime()) < 5000,
          );

          if (exists) {
            return prevMessages;
          }

          return [...prevMessages, tempMessage];
        });
      }
    });

    // Reset processing flag after a short delay
    setTimeout(() => {
      isProcessingRef.current = false;
      // Process any new messages that arrived while we were processing
      if (messageQueueRef.current.length > 0) {
        processMessageQueue();
      }
    }, 100);
  }, [ticket?.id]);

  // Handle new messages from WebSocket
  const handleNewMessage = useCallback(
    (messageData: any) => {
      // Add to queue instead of processing immediately
      messageQueueRef.current.push(messageData);

      // Process the queue
      processMessageQueue();
    },
    [processMessageQueue],
  );

  // Handle new replies from WebSocket with better thread matching
  const handleNewReply = useCallback((replyData: any) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((message) => {
        // Better thread matching - convert both to numbers for comparison
        const messageThreadId = message.thread_id || message.id;
        const replyThreadId = replyData.reply.thread;

        // Convert to numbers if they're strings for proper comparison
        const messageIdNum = typeof messageThreadId === "string" ? parseInt(messageThreadId, 10) : messageThreadId;
        const replyIdNum = typeof replyThreadId === "string" ? parseInt(replyThreadId, 10) : replyThreadId;

        if (messageIdNum === replyIdNum) {
          // Check if reply already exists to avoid duplicates
          const exists = message.replies.some(
            (reply) =>
              reply.content === replyData.reply.content &&
              reply.created_by === replyData.reply.created_by &&
              Math.abs(new Date(reply.created_at).getTime() - new Date(replyData.reply.created_at).getTime()) < 5000,
          );

          if (!exists) {
            return {
              ...message,
              replies: [...message.replies, replyData.reply],
            };
          } else {
            // console.log('Reply already exists, skipping duplicate')
          }
        }
        return message;
      });

      return updatedMessages;
    });
  }, []);

  // Use WebSocket hook for notifications and thread messages
  const { isConnected, connectionError, sendMessage, sendReply, connectToReplySocket } = useTaskThread({
    taskId: ticket?.id ? (typeof ticket.id === "string" ? parseInt(ticket.id, 10) : ticket.id) : null,
    isOpen,
    onNewMessage: handleNewMessage,
    onNewReply: handleNewReply,
  });

  const fetchMessages = useCallback(async () => {
    if (ticket?.id) {
      setLoadingMessages(true);
      try {
        const taskId = typeof ticket.id === "string" ? parseInt(ticket.id, 10) : ticket.id;
        const fetchedMessages = await threadApi.getTaskMessages(taskId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    }
  }, [ticket?.id]);

  useEffect(() => {
    if (ticket) {
      // console.log('opening ticket-----------:', ticket)
      setEditedTicket(ticket);
      setDescription(ticket.description || "");
      fetchMessages();

      // Reset scroll behavior when opening modal
      setShouldAutoScroll(true);
      setHasUserScrolled(false);

      // Initialize existing images
      setExistingImages(ticket.images || []);
      setSelectedImages([]);
      setImagePreviews([]);

      // Initialize assignee IDs from assigned_to array or fall back to matching employee names
      let assigneeIds: string[] = [];

      if (Array.isArray(ticket.assignedTo)) {
        // New format: extract IDs from the array
        assigneeIds = ticket.assignedTo.map((user) => {
          // Try to find matching employee by username
          const employee = employees.find((emp) => emp.employee_name === user.username);
          return employee ? employee.employee_code.toString() : user.id.toString();
        });
      } else if (typeof ticket.assignedTo === "string") {
        // Old format: match names to employee codes
        const assigneeNames = getAssigneeNames(ticket.assignedTo);
        assigneeIds = employees
          .filter((emp) => assigneeNames.includes(emp.employee_name))
          .map((emp) => emp.employee_code.toString());
      }

      setSelectedAssigneeIds(assigneeIds);
    }
  }, [ticket, fetchMessages, employees]);

  // Modified scroll effect - only scroll on initial load or new messages when at bottom
  useEffect(() => {
    if (messages.length > 0 && shouldAutoScroll) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, scrollToBottom, shouldAutoScroll]);

  // Update allImages whenever existingImages or imagePreviews change
  useEffect(() => {
    const combined = [...existingImages.map((img: any) => img.image_url), ...imagePreviews];
    setAllImages(combined);
  }, [existingImages, imagePreviews]);

  // Log connection status changes
  useEffect(() => {
    if (connectionError) {
      // console.log('Connection error:', connectionError)
    }
  }, [isConnected, connectionError]);

  if (!ticket || !editedTicket) {
    return null;
  }

  // Handle new image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove new image before upload
  const handleRemoveNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete existing image from database
  const handleRemoveExistingImage = async (imageId: number) => {
    if (deletingImageId) return; // Prevent multiple deletions at once

    setDeletingImageId(imageId);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/image/${imageId}/`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      const result = await response.json();
      console.log("Image deleted:", result);

      // Remove image from UI immediately after successful deletion
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));

      // Show success toast
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  // Open image preview modal
  const handleOpenImagePreview = (index: number) => {
    setCurrentImageIndex(index);
    setIsImagePreviewOpen(true);
  };

  // Navigate to next image
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  // Navigate to previous image
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleSave = async () => {
    if (editedTicket && !isSaving) {
      setIsSaving(true);
      try {
        // Create FormData for multipart upload
        const formDataToSend = new FormData();

        // Add ticket ID for update
        formDataToSend.append("id", editedTicket.id.toString());

        // Add all task fields
        formDataToSend.append("title", editedTicket.subject);
        formDataToSend.append("description", description);
        formDataToSend.append("priority", editedTicket.priority);
        formDataToSend.append("status", editedTicket.status);

        if (editedTicket.dueDate) {
          formDataToSend.append("deadline", editedTicket.dueDate);
        }

        if (editedTicket.createdAt) {
          formDataToSend.append("creation", editedTicket.createdAt);
        }

        if (editedTicket.completedAt) {
          formDataToSend.append("completion", editedTicket.completedAt);
        }

        // Add assigned user IDs
        selectedAssigneeIds.forEach((userId) => {
          formDataToSend.append("assigned_to", userId);
        });

        // Add new images
        selectedImages.forEach((image) => {
          formDataToSend.append("images", image);
        });

        const result = onSave(formDataToSend);

        // Wait for the save to complete if it returns a promise
        if (result && typeof result.then === "function") {
          await result;
        }

        // Refresh the task details after successful save
        if (ticket?.id) {
          await fetchMessages();
          // Reset image states after successful save
          setSelectedImages([]);
          setImagePreviews([]);
        }
      } catch (error) {
        console.error("Error saving task:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && sendMessage && !isSendingMessage) {
      setIsSendingMessage(true); // Prevent double calls

      try {
        const userData = localStorage.getItem("userData");
        const currentUser = userData ? JSON.parse(userData) : null;
        const username = currentUser?.username || "anonymous";
        const currentUserId = currentUser?.id;

        // Get assigned user IDs and names for notifications
        const assignedUserIds = selectedAssigneeIds
          .map((id) => {
            const employee = employees.find((emp) => emp.employee_code.toString() === id);
            return employee?.employee_code || parseInt(id);
          })
          .filter((id) => id !== currentUserId); // Exclude sender from notifications

        // console.log('=== SENDING MESSAGE NOTIFICATION ===')
        // console.log('Current User ID:', currentUserId)
        // console.log('Selected Assignee IDs:', selectedAssigneeIds)
        // console.log('Assigned User IDs for notification:', assignedUserIds)
        // console.log('Message:', newMessage.trim())
        // console.log('Task:', editedTicket.subject)

        // Send message via WebSocket first
        await sendMessage(newMessage.trim(), username);

        // Send notification to assigned users (excluding sender)
        if (assignedUserIds.length > 0) {
          const notificationMessage = `New message from ${username} on task: "${editedTicket.subject}"`;

          const success = sendTaskNotification(
            notificationMessage,
            assignedUserIds,
            typeof editedTicket.id === "string" ? parseInt(editedTicket.id, 10) : editedTicket.id,
            "Task Message", // Use generic project name since projectName doesn't exist
          );

          if (success) {
            // console.log('✅ Message notification sent successfully to assigned users')
          } else {
            // console.log('❌ Failed to send message notification')
          }
        } else {
          // console.log('ℹ️ No other assigned users to notify (sender excluded)')
        }

        // Clear input only after successful send
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSendingMessage(false);
      }
    }
  };

  const handleReply = (threadId: number, replyContent: string) => {
    if (sendReply) {
      const userData = localStorage.getItem("userData");
      const currentUser = userData ? JSON.parse(userData) : null;
      const username = currentUser?.username || "anonymous";
      const currentUserId = currentUser?.id;

      // Get assigned user IDs for notifications (excluding sender)
      const assignedUserIds = selectedAssigneeIds
        .map((id) => {
          const employee = employees.find((emp) => emp.employee_code.toString() === id);
          return employee?.employee_code || parseInt(id);
        })
        .filter((id) => id !== currentUserId); // Exclude sender from notifications

      // console.log('=== SENDING REPLY NOTIFICATION ===')
      // console.log('Current User ID:', currentUserId)
      // console.log('Assigned User IDs for notification:', assignedUserIds)
      // console.log('Reply:', replyContent)
      // console.log('Task:', editedTicket.subject)

      // Send reply via WebSocket
      sendReply(threadId, replyContent);

      // Send notification to assigned users (excluding sender)
      if (assignedUserIds.length > 0) {
        const notificationMessage = `New reply from ${username} on task: "${editedTicket.subject}"`;

        const success = sendTaskNotification(
          notificationMessage,
          assignedUserIds,
          typeof editedTicket.id === "string" ? parseInt(editedTicket.id, 10) : editedTicket.id,
          "Task Reply",
        );

        if (success) {
          // console.log('✅ Reply notification sent successfully to assigned users')
        } else {
          // console.log('❌ Failed to send reply notification')
        }
      } else {
        // console.log('ℹ️ No other assigned users to notify (sender excluded)')
      }
    }
  };

  const handleReplySocketConnect = () => {
    if (connectToReplySocket) {
      connectToReplySocket();
    }
  };

  const assigneeNames = getAssigneeNames(editedTicket.assignedTo);
  const normalizedPriority = normalizePriority(editedTicket.priority);

  // Transform employees to options for MultiSelect
  // @ts-ignore
  const employeeOptions = ticket?.assignedTo?.map((user) => ({
    value: user.id.toString(),
    label: user.username,
  }));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-7xl w-[95vw] h-[95vh] max-h-[95vh] bg-background border-0 shadow-2xl p-0 overflow-hidden rounded-2xl [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {isCompactView ? (
            // Mobile & Tablet Layout with Tabs
            <div className="flex h-full flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-background dark:from-slate-900 dark:to-background">
              {/* Enhanced Header */}
              <div className="h-16 px-4 border-b border-border bg-background flex items-center shrink-0 shadow-sm">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Task Details</div>
                      <div className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded-md">
                        {editedTicket.ticketNumber}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
                <TabsList className="w-full rounded-none border-b bg-muted/50">
                  <TabsTrigger value="details" className="flex-1">
                    <Target className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="discussion" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Discussion
                    {messages.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                        {messages.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="flex-1 min-h-0 m-0 overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Title Section */}
                    <div className="px-4 py-4 bg-background border-b border-border shrink-0">
                      <Input
                        value={editedTicket.subject}
                        onChange={(e) => setEditedTicket({ ...editedTicket, subject: e.target.value })}
                        className="text-lg font-bold border-0 px-0 py-0 h-auto bg-transparent hover:bg-muted focus:bg-background transition-all duration-200 rounded-lg focus-visible:ring-2 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground"
                        placeholder="Task title..."
                      />
                    </div>

                    {/* Scrollable Content */}
                    <ScrollArea className="flex-1">
                      <div className="px-4 py-4 space-y-4">
                        {/* Properties Section - Mobile Optimized */}
                        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                          <h3 className="text-sm font-bold text-foreground mb-4">Properties</h3>
                          <div className="space-y-3">
                            {/* Status */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <Target className="h-3.5 w-3.5" />
                                Status
                              </div>
                              <Select
                                value={editedTicket.status}
                                onValueChange={(value) => setEditedTicket({ ...editedTicket, status: value })}
                              >
                                <SelectTrigger className={`w-full ${getStatusColor(editedTicket.status)}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Open">Open</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Testing">Testing</SelectItem>
                                  <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Priority */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <Flag className="h-3.5 w-3.5" />
                                Priority
                              </div>
                              <Select
                                value={normalizedPriority}
                                onValueChange={(value) => setEditedTicket({ ...editedTicket, priority: value })}
                              >
                                <SelectTrigger className={`w-full ${getPriorityColor(normalizedPriority)}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Assignees */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <Users className="h-3.5 w-3.5" />
                                Assignees
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {assigneeNames.length > 0 ? (
                                  assigneeNames.map((name, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {name}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">No assignees</span>
                                )}
                              </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Created
                                </div>
                                <div className="text-xs text-foreground font-medium">{editedTicket.createdAt}</div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  Due Date
                                </div>
                                <div className="text-xs text-foreground font-medium">
                                  {editedTicket.dueDate || "Not set"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Images Section - Mobile Optimized */}
                        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                          {/* Header with Add Images Button */}
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-foreground">Attached Images</h3>

                            {/* Add Images Button - Top Right */}
                            <label className="inline-block">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                              />
                              <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer text-xs font-medium shadow-md hover:shadow-lg">
                                <ImageIcon className="h-3.5 w-3.5" />
                                <span>Add Images</span>
                              </div>
                            </label>
                          </div>

                          {/* Horizontal Scrollable Image Gallery */}
                          {(existingImages.length > 0 || imagePreviews.length > 0) && (
                            <div className="overflow-x-auto pb-2">
                              <div className="flex gap-3 min-w-min">
                                {allImages.map((imageSrc, index) => {
                                  const isExistingImage = index < existingImages.length;
                                  const imageData = isExistingImage ? existingImages[index] : null;

                                  return (
                                    <div
                                      key={index}
                                      className="group relative flex-shrink-0 w-32 h-32 overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-all shadow-md hover:shadow-lg cursor-pointer"
                                      onClick={() => handleOpenImagePreview(index)}
                                    >
                                      <img
                                        src={imageSrc}
                                        alt={imageData?.image_name || `Image ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                      />

                                      {/* Delete button for existing images */}
                                      {isExistingImage && imageData && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveExistingImage(imageData.id);
                                          }}
                                          disabled={deletingImageId === imageData.id}
                                          className="absolute top-1.5 right-1.5 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {deletingImageId === imageData.id ? (
                                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                          ) : (
                                            <X className="h-3 w-3" />
                                          )}
                                        </button>
                                      )}

                                      {/* Delete button for new images */}
                                      {!isExistingImage && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveNewImage(index - existingImages.length);
                                          }}
                                          className="absolute top-1.5 right-1.5 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-lg z-10"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Empty State */}
                          {existingImages.length === 0 && imagePreviews.length === 0 && (
                            <div className="text-center py-6 text-muted-foreground">
                              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                              <p className="text-xs">No images attached yet</p>
                            </div>
                          )}
                        </div>

                        {/* Description Section - Mobile Optimized */}
                        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                          <h3 className="text-sm font-bold text-foreground mb-3">Description</h3>
                          <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add task description..."
                            className="min-h-[120px] text-sm resize-none"
                          />
                        </div>
                      </div>
                    </ScrollArea>

                    {/* Save Button */}
                    <div className="px-4 py-3 bg-background border-t border-border shrink-0">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="discussion" className="flex-1 min-h-0 m-0 overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Messages Area */}
                    <ScrollArea className="flex-1" ref={scrollAreaRef} onScroll={handleScroll}>
                      <div className="p-4 space-y-1">
                        {loadingMessages ? (
                          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <div className="w-12 h-12 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                              <Clock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-semibold mb-1">Loading...</p>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-2xl flex items-center justify-center mb-4">
                              <Send className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="text-sm font-semibold text-foreground mb-1">Start the conversation</p>
                            <p className="text-xs text-muted-foreground text-center px-4">
                              Share updates with your team
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {messages.map((message) => (
                              <ThreadMessage
                                key={message.id}
                                message={message}
                                onReply={handleReply}
                                onReplySocketConnect={handleReplySocketConnect}
                              />
                            ))}
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="px-4 py-3 bg-background border-t border-border shrink-0">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                          placeholder="Type a message..."
                          className="flex-1"
                          disabled={isSendingMessage || !isConnected}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isSendingMessage || !isConnected}
                          size="icon"
                          className="shrink-0"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Desktop Layout
            <div className="flex h-full flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-slate-50 to-background dark:from-slate-900 dark:to-background">
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Enhanced Header */}
                <div className="h-20 px-8 border-b border-border bg-background flex items-center shrink-0 shadow-sm">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-foreground">Task Details</div>
                          <div className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md">
                            {editedTicket.ticketNumber}
                          </div>
                        </div>
                      </div>
                      {/* Enhanced WebSocket Status Indicator */}
                      <div className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border border-border shadow-sm">
                        {isConnected ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <Wifi className="h-4 w-4" />
                            <span className="text-sm font-medium">Live</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <WifiOff className="h-4 w-4" />
                            <span className="text-sm font-medium">Offline</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Enhanced Title Section */}
                <div className="px-8 py-6 bg-background border-b border-border shrink-0">
                  <Input
                    value={editedTicket.subject}
                    onChange={(e) => setEditedTicket({ ...editedTicket, subject: e.target.value })}
                    className="text-2xl font-bold border-0 px-0 py-0 h-auto bg-transparent hover:bg-muted focus:bg-background transition-all duration-200 rounded-lg focus-visible:ring-2 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground"
                    placeholder="Task title..."
                  />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 min-h-0 overflow-hidden bg-gradient-to-b from-muted/50 to-background">
                  <ScrollArea className="h-full">
                    <div className="px-8 py-8 space-y-8">
                      {/* Enhanced Properties Section */}
                      <div className="bg-card rounded-2xl p-8 shadow-sm border border-border backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-foreground mb-8 flex items-center gap-3">
                          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                          Task Properties
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                          {/* Enhanced Status */}
                          <div className="space-y-4">
                            <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                              Status
                            </label>
                            <Badge
                              className={`${getStatusColor(editedTicket.status)} text-sm px-4 py-2 font-semibold border-2 rounded-xl w-fit shadow-sm`}
                            >
                              {editedTicket.status}
                            </Badge>
                          </div>

                          {/* Enhanced Priority */}
                          <div className="space-y-4">
                            <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                              <Flag className="w-4 h-4 text-muted-foreground" />
                              Priority
                            </label>
                            <Select
                              value={normalizedPriority}
                              onValueChange={(value) => setEditedTicket({ ...editedTicket, priority: value })}
                            >
                              <SelectTrigger
                                className={`${getPriorityColor(normalizedPriority)} text-sm border-2 rounded-xl font-semibold h-12 shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-ring`}
                              >
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-2 shadow-xl rounded-xl">
                                <SelectItem
                                  value="High"
                                  className="text-red-700 focus:bg-red-50 dark:focus:bg-red-950/50 rounded-lg my-1"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                                    <span className="font-medium">High Priority</span>
                                  </div>
                                </SelectItem>
                                <SelectItem
                                  value="Medium"
                                  className="text-amber-700 focus:bg-amber-50 dark:focus:bg-amber-950/50 rounded-lg my-1"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
                                    <span className="font-medium">Medium Priority</span>
                                  </div>
                                </SelectItem>
                                <SelectItem
                                  value="Low"
                                  className="text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/50 rounded-lg my-1"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                                    <span className="font-medium">Low Priority</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Enhanced Requester */}
                          <div className="space-y-4">
                            <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                              <User className="w-4 h-4 text-muted-foreground" />
                              Requester
                            </label>
                            <Input
                              value={editedTicket.requester}
                              onChange={(e) => setEditedTicket({ ...editedTicket, requester: e.target.value })}
                              className="text-sm h-12 bg-muted border-2 border-border rounded-xl shadow-sm focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                              placeholder="Enter requester email"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                          {/* Enhanced Assignees - Always editable dropdown */}
                          <div className="space-y-4">
                            <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              Assignees
                            </label>

                            <MultiSelect
                              options={employeeOptions}
                              selected={selectedAssigneeIds}
                              onChange={setSelectedAssigneeIds}
                              placeholder="Select assignees..."
                              className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-ring rounded-xl min-h-[48px] text-sm w-full bg-background shadow-sm"
                            />
                          </div>

                          {/* Enhanced Start Date */}
                          <div className="space-y-4">
                            <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                              <CalendarDays className="w-4 h-4 text-muted-foreground" />
                              Start Date
                            </label>
                            <Input
                              type="date"
                              value={editedTicket.dueDate ? editedTicket.dueDate.split("T")[0] : ""}
                              onChange={(e) => setEditedTicket({ ...editedTicket, dueDate: e.target.value })}
                              className="text-sm h-12 bg-muted border-2 border-border rounded-xl shadow-sm focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                            />
                          </div>

                          {/* Enhanced End Date */}
                          <div className="space-y-4">
                            <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              End Date
                            </label>
                            <Input
                              type="date"
                              value={editedTicket.completedAt ? editedTicket.completedAt.split("T")[0] : ""}
                              onChange={(e) => setEditedTicket({ ...editedTicket, completedAt: e.target.value })}
                              className="text-sm h-12 bg-muted border-2 border-border rounded-xl shadow-sm focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Images Section */}
                      <div className="bg-card rounded-2xl p-8 shadow-sm border border-border backdrop-blur-sm">
                        {/* Header with Add Images Button */}
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                            Attached Images
                          </h3>

                          {/* Add Images Button - Top Right */}
                          <label className="inline-block">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="hidden"
                            />
                            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer font-medium shadow-md hover:shadow-lg">
                              <ImageIcon className="h-4 w-4" />
                              <span>Add Images</span>
                            </div>
                          </label>
                        </div>

                        {/* Horizontal Scrollable Image Gallery */}
                        {(existingImages.length > 0 || imagePreviews.length > 0) && (
                          <div className="overflow-x-auto pb-2">
                            <div className="flex gap-4 min-w-min">
                              {allImages.map((imageSrc, index) => {
                                const isExistingImage = index < existingImages.length;
                                const imageData = isExistingImage ? existingImages[index] : null;

                                return (
                                  <div
                                    key={index}
                                    className="group relative flex-shrink-0 w-44 h-44 overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all shadow-md hover:shadow-xl cursor-pointer"
                                    onClick={() => handleOpenImagePreview(index)}
                                  >
                                    <img
                                      src={imageSrc}
                                      alt={imageData?.image_name || `Image ${index + 1}`}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />

                                    {/* Delete button for existing images */}
                                    {isExistingImage && imageData && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveExistingImage(imageData.id);
                                        }}
                                        disabled={deletingImageId === imageData.id}
                                        className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {deletingImageId === imageData.id ? (
                                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                          <X className="h-3.5 w-3.5" />
                                        )}
                                      </button>
                                    )}

                                    {/* Delete button for new images */}
                                    {!isExistingImage && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveNewImage(index - existingImages.length);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-lg z-10"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Empty State */}
                        {existingImages.length === 0 && imagePreviews.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No images attached yet</p>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Details Section */}
                      <div className="bg-card rounded-2xl p-8 shadow-sm border border-border backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                          <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                          Task Details
                        </h3>
                        <Textarea
                          placeholder="Add detailed description of the task, requirements, and any additional information..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[200px] resize-none text-sm bg-muted border-2 border-border rounded-xl shadow-sm focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                {/* Enhanced Save Button Area */}
                <div className="h-24 border-t border-border bg-background px-8 flex items-center justify-end gap-4 shrink-0 shadow-sm">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="h-12 px-8 rounded-xl border-2 border-border hover:border-primary hover:bg-muted font-medium transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Redesigned Professional Chat Sidebar */}
              <div className="w-full lg:w-96 flex flex-col shrink-0 bg-gradient-to-b from-muted/50 to-background border-l border-border">
                {/* Professional Chat Header */}
                <div className="px-6 py-6 border-b border-border bg-background/95 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Discussion</h3>
                        <p className="text-sm text-muted-foreground font-medium">Team collaboration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-full px-4 py-2 font-medium border border-border">
                        <Hash className="h-4 w-4" />
                        {loadingMessages ? "..." : messages.length}
                      </div>
                      {isConnected ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                      ) : (
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Messages Area with scroll handling */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ScrollArea className="h-full" ref={scrollAreaRef} onScroll={handleScroll}>
                    <div className="p-6 space-y-1">
                      {loadingMessages ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                          <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
                            <Clock className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-semibold mb-2">Loading conversation...</p>
                          <p className="text-sm text-muted-foreground">Fetching latest messages</p>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-3xl flex items-center justify-center mb-6">
                            <Send className="h-8 w-8 text-blue-600" />
                          </div>
                          <p className="text-lg font-semibold text-foreground mb-2">Start the conversation</p>
                          <p className="text-sm text-muted-foreground text-center px-6">
                            Share updates, ask questions, or collaborate with your team members
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {messages.map((message) => (
                            <ThreadMessage
                              key={message.id}
                              message={message}
                              onReply={handleReply}
                              onReplySocketConnect={handleReplySocketConnect}
                            />
                          ))}
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Enhanced Message Input */}
                <div className="p-6 border-t border-border bg-card/50 backdrop-blur-sm">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Type your message... (Shift+Enter for new line)"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        autoResize
                        className="pr-12 text-sm bg-background border-2 border-input rounded-xl shadow-sm focus:ring-2 focus:ring-ring focus:border-primary transition-all min-h-[48px] max-h-[200px]"
                        disabled={isSendingMessage}
                      />
                      {newMessage.trim() && (
                        <div className="absolute right-4 top-4">
                          <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSendingMessage}
                      className="h-12 w-12 p-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      {isSendingMessage ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-5 w-5 text-primary-foreground" />
                      )}
                    </Button>
                  </div>

                  {/* Enhanced Status Area */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-5">
                      {isSendingMessage && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="font-medium">Sending message...</span>
                        </div>
                      )}
                    </div>

                    {hasUserScrolled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShouldAutoScroll(true);
                          setHasUserScrolled(false);
                          scrollToBottom();
                        }}
                        className="h-7 px-3 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all"
                      >
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Scroll to bottom
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal with Navigation */}
      {isImagePreviewOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setIsImagePreviewOpen(false)}
          style={{ pointerEvents: "auto" }}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsImagePreviewOpen(false);
            }}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm z-10"
            style={{ pointerEvents: "auto" }}
            aria-label="Close image preview"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Previous Button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-110 backdrop-blur-sm z-10"
              style={{ pointerEvents: "auto" }}
              aria-label="Previous image"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={allImages[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1} of ${allImages.length}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Next Button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-110 backdrop-blur-sm z-10"
              style={{ pointerEvents: "auto" }}
              aria-label="Next image"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}
