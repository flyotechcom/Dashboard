import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, Plus, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Report {
    id: string;
    name: string;
    date: string;
    type: string;
    status: 'Ready' | 'Processing' | 'Failed';
    size: string;
}

const Reports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([
        {
            id: "R-2024-001",
            name: "Weekly Traffic Analysis",
            date: "2024-03-20",
            type: "Traffic",
            status: "Ready",
            size: "2.4 MB"
        },
        {
            id: "R-2024-002",
            name: "Driver Performance Review",
            date: "2024-03-19",
            type: "Performance",
            status: "Ready",
            size: "1.8 MB"
        },
        {
            id: "R-2024-003",
            name: "Route Efficiency Report",
            date: "2024-03-18",
            type: "Optimization",
            status: "Ready",
            size: "3.2 MB"
        },
        {
            id: "R-2024-004",
            name: "Safety Incidents Summary",
            date: "2024-03-15",
            type: "Safety",
            status: "Ready",
            size: "1.1 MB"
        },
        {
            id: "R-2024-005",
            name: "Monthly Fuel Consumption",
            date: "2024-03-01",
            type: "Fuel",
            status: "Processing",
            size: "-"
        }
    ]);

    const [filterType, setFilterType] = useState<string | null>(null);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [newReportName, setNewReportName] = useState("");
    const [newReportType, setNewReportType] = useState("Traffic");

    const handleGenerateReport = () => {
        if (!newReportName) {
            toast.error("Please enter a report name");
            return;
        }

        const newReport: Report = {
            id: `R-2024-${String(reports.length + 1).padStart(3, '0')}`,
            name: newReportName,
            date: new Date().toISOString().split('T')[0],
            type: newReportType,
            status: 'Processing',
            size: '-'
        };

        setReports([newReport, ...reports]);
        setIsGenerateOpen(false);
        setNewReportName("");
        toast.success("Report generation started");

        // Simulate completion
        setTimeout(() => {
            setReports(current =>
                current.map(r =>
                    r.id === newReport.id
                        ? { ...r, status: 'Ready', size: `${(Math.random() * 5).toFixed(1)} MB` }
                        : r
                )
            );
            toast.success(`${newReport.name} is ready!`);
        }, 3000);
    };

    const handleDownload = (report: Report) => {
        toast.info(`Downloading ${report.name}...`);
        // Simulate download delay
        setTimeout(() => {
            toast.success("Download complete");
        }, 1500);
    };

    const filteredReports = filterType
        ? reports.filter(r => r.type === filterType)
        : reports;

    const uniqueTypes = Array.from(new Set(reports.map(r => r.type)));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Reports</h1>
                    <p className="text-muted-foreground mt-1">
                        View and download your analytical reports
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto gap-2">
                                <Filter className="w-4 h-4" />
                                {filterType ? filterType : "Filter"}
                                <ChevronDown className="w-4 h-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setFilterType(null)}>
                                All Types
                                {filterType === null && <Check className="ml-auto w-4 h-4" />}
                            </DropdownMenuItem>
                            {uniqueTypes.map(type => (
                                <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                                    {type}
                                    {filterType === type && <Check className="ml-auto w-4 h-4" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto gap-2">
                                <Plus className="w-4 h-4" />
                                Generate New Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Generate New Report</DialogTitle>
                                <DialogDescription>
                                    Select the report type and name to generate a new analysis.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Report Name</Label>
                                    <Input
                                        id="name"
                                        value={newReportName}
                                        onChange={(e) => setNewReportName(e.target.value)}
                                        placeholder="e.g., Q1 Performance Review"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Report Type</Label>
                                    <Select value={newReportType} onValueChange={setNewReportType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Traffic">Traffic Analysis</SelectItem>
                                            <SelectItem value="Performance">Driver Performance</SelectItem>
                                            <SelectItem value="Optimization">Route Optimization</SelectItem>
                                            <SelectItem value="Safety">Safety Incidents</SelectItem>
                                            <SelectItem value="Fuel">Fuel Consumption</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
                                <Button onClick={handleGenerateReport}>Generate</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Reports
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reports.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Across {uniqueTypes.length} categories
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Storage Used
                        </CardTitle>
                        <Download className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reports.reduce((acc, curr) => {
                                const size = parseFloat(curr.size);
                                return isNaN(size) ? acc : acc + size;
                            }, 0).toFixed(1)} MB
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total file size
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Processing
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reports.filter(r => r.status === 'Processing').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active jobs
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>
                        A list of your recently generated reports.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Report Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date Generated</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No reports found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    {report.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">{report.type}</TableCell>
                                            <TableCell className="whitespace-nowrap">{report.date}</TableCell>
                                            <TableCell className="whitespace-nowrap">{report.size}</TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 ${report.status === 'Ready'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : report.status === 'Processing'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {report.status === 'Processing' && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                                    )}
                                                    {report.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={report.status !== 'Ready'}
                                                    onClick={() => handleDownload(report)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Reports;
