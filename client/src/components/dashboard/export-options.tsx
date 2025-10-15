import { motion } from "framer-motion";
import { FileText, Download, FileType } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToJSON } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

export function ExportOptions() {
  const { toast } = useToast();

  const handleExportCSV = async () => {
    try {
      await exportToCSV();
      toast({
        title: "Export successful",
        description: "Jobs data exported to CSV format",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export CSV file",
        variant: "destructive",
      });
    }
  };

  const handleExportJSON = async () => {
    try {
      await exportToJSON();
      toast({
        title: "Export successful", 
        description: "Jobs data exported to JSON format",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export JSON file",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = () => {
    // TODO: Implement PDF report generation
    toast({
      title: "Coming soon",
      description: "PDF report generation will be available soon",
    });
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={handleExportCSV}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            data-testid="button-export-csv"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={handleExportJSON}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            data-testid="button-export-json"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to JSON
          </Button>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={handleGenerateReport}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            data-testid="button-generate-report"
          >
            <FileType className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
