import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
  _id: string;
  imageUrl: string;
  results: {
    e_coli: number;
    klebsiella: number;
    acinetobacter: number;
    pseudomonas: number;
    enterobacter: number;
  };
  confidence: {
    e_coli: number;
    klebsiella: number;
    acinetobacter: number;
    pseudomonas: number;
    enterobacter: number;
  };
  notes?: string;
  timestamp: string;
}

interface Props {
  result: AnalysisResult;
}

export default function AnalysisResult({ result }: Props) {
  const bacteriaTypes = [
    { key: "e_coli", name: "E. coli" },
    { key: "klebsiella", name: "Klebsiella" },
    { key: "acinetobacter", name: "Acinetobacter" },
    { key: "pseudomonas", name: "Pseudomonas" },
    { key: "enterobacter", name: "Enterobacter" },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Analysis Results</span>
          <span className="text-sm font-normal text-muted-foreground">
            {new Date(result.timestamp).toLocaleString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={result.imageUrl}
              alt="Analyzed sample"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            {bacteriaTypes.map(({ key, name }) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="text-muted-foreground">
                    {(result.results[key] * 100).toFixed(1)}% (
                    {(result.confidence[key] * 100).toFixed(1)}% confidence)
                  </span>
                </div>
                <Progress value={result.results[key] * 100} />
              </div>
            ))}
          </div>

          {result.notes && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">{result.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}