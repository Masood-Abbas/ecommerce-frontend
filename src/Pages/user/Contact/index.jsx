import { useFormik } from "formik";
import emailjs from "@emailjs/browser";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { contactInfo } from "@/utils/static/contactData";
import SuccessPopup from "@/components/user/popup/ContactPopup";
import { contactFormSchema } from "@/utils/validation/contactFrom";
import ContactInfoCard from "@/components/user/contactComponent/contactInfo";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";

const ContactPage = () => {
  const formRef = useRef();

  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },

    validationSchema: contactFormSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        await emailjs.send(
          import.meta.env.VITE_SERVICE_ID,
          import.meta.env.VITE_TEMPLATE_ID,
          {
            from_name: values.name,
            from_email: values.email,
            from_phone: values.phone,
            message: values.message,
            to_name: import.meta.env.VITE_TO_USER,
            to_email: import.meta.env.VITE_TO_EMAIL,
          },
          import.meta.env.VITE_PUBLIC_KEY
        );

        setOpenSuccess(true);
        resetForm();
      } catch (error) {
        console.error(error);
        alert("Failed to send message. Try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {/* SUCCESS POPUP */}
      <SuccessPopup
        open={openSuccess}
        setOpen={setOpenSuccess}
        title="Message Sent Successfully!"
        message="Thank you for contacting us. We will get back to you within 24 hours."
      />

      {/* MAIN UI */}
      <div className="main-container py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT SIDE INFO */}
        <div className="space-y-6">
          {contactInfo.map((item, index) => (
            <ContactInfoCard
              key={index}
              icon={item.icon}
              title={item.title}
              lines={item.lines}
            />
          ))}
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-xl font-semibold font-Inter mb-1">
            Send us a Message
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>

          <form
            ref={formRef}
            onSubmit={formik.handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* NAME */}
              <div className="space-y-1">
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="name"
                  placeholder="Enter your name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="border-b pb-2"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm">{formik.errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="space-y-1">
                <Label>
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="border-b pb-2"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>

              {/* PHONE */}
              <div className="space-y-1">
                <Label>
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="phone"
                  placeholder="+92 300 0000000"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className="border-b pb-2"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                )}
              </div>
            </div>

            {/* MESSAGE */}
            <div className="space-y-1">
              <Label>
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="message"
                placeholder="Write your message..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                className="min-h-[140px] border-b pb-2"
              />
              {formik.touched.message && formik.errors.message && (
                <p className="text-red-500 text-sm">{formik.errors.message}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-(--primary-color) hover:bg-(--hover-primary-color) text-white rounded-xl"
            >
              {loading ? <LoadingSpot text="Sending..." className="pt-0 text-white"/> : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
