import { Link } from "wouter";
import { Microscope } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Microscope className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">EKAPE Analysis</h1>
          </div>
          <Link href="/reports">
            <Button variant="outline">View Reports</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Analyze Urine Sample</CardTitle>
            <CardDescription>
              Upload a microscopic image of your urine sample for EKAPE bacteria detection
            </CardDescription>
          </CardHeader>
          <ImageUpload />
        </Card>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">High Accuracy</h3>
            <p className="text-sm text-muted-foreground">
              Advanced ML model trained on thousands of samples
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Quick Results</h3>
            <p className="text-sm text-muted-foreground">
              Get analysis results within seconds
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Detailed Reports</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive bacterial analysis with confidence scores
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
