import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, ErrorMessage } from "formik";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { updateProfileSchema } from "@/utils/validation/updateProfileSchema";
import { updateUser } from "@/Redux/authSlice/authSlice";

export default function ProfileEdit({ profile, setProfile, setActiveTab }) {
  console.log("first profile password", profile.password);

  const { fetchApi, loading } = useApiResponse({
    method: "patch",
    reduxAction: updateUser,
  });

  const handleSubmit = async (values) => {
    const updatedProfile = {
      ...profile,
      name: values.name,
      email: values.email,
      role: values.role,
    };
    if (values.password && values.password.trim().length > 0) {
      updatedProfile.password = values.password.trim();
    }
    console.log("updatedProfile.password", updatedProfile.password);
    setProfile(updatedProfile);

    const res = await fetchApi({}, `/user/updateUser`, updatedProfile);

    setActiveTab("profile");
  };

  return (
    <Card className="shadow-lg mb-6">
      <CardContent className="space-y-4 py-6">
        <h2 className="text-xl font-medium mb-2">Edit Profile</h2>

        <Formik
          initialValues={{
            name: profile.name,
            email: profile.email,
            role: profile.role,
            password: "",
          }}
          validationSchema={updateProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur }) => (
            <Form className="space-y-4">
              <div>
                <label className="font-medium">Full Name</label>
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-medium">Email</label>
                <Input
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Role (Disabled) */}
              <div>
                <label className="font-medium">Role</label>
                <Input
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  disabled
                  className="mt-1 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-medium">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1"
                  placeholder="Enter new password"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-(--primary-color) hover:bg-(--hover-primary-color)"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  variant="outline"
                  className="w-1/2"
                  onClick={() => setActiveTab("profile")}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
