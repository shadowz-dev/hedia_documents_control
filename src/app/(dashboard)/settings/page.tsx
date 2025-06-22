import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Manage how you receive notifications from the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-6">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="expiry-reminders" className="flex flex-col space-y-1">
                  <span>Document Expiration Reminders</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive emails when documents are about to expire.
                  </span>
                </Label>
                <Switch id="expiry-reminders" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="renewal-deadlines" className="flex flex-col space-y-1">
                  <span>Renewal Deadlines</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get notified about upcoming renewal deadlines.
                  </span>
                </Label>
                <Switch id="renewal-deadlines" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="appointments" className="flex flex-col space-y-1">
                  <span>Upcoming Appointments</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Reminders for scheduled appointments in the calendar.
                  </span>
                </Label>
                <Switch id="appointments" />
              </div>
               <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="report-generation" className="flex flex-col space-y-1">
                  <span>Automated Reports</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive scheduled reports directly in your inbox.
                  </span>
                </Label>
                <Switch id="report-generation" defaultChecked />
              </div>
              <Button className="ml-auto">Save Preferences</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
