import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  Bug,
  HelpCircle,
  Briefcase,
  Trash2,
  ExternalLink,
  Download,
  Filter,
  Check,
  ChevronDown,
  Inbox,
  AlertCircle,
  ArrowUpRight,
  Send,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  ContactInquiry,
  getLocalInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "@/lib/contact-service";

export const Route = createFileRoute("/admin/inquiries")({
  head: () => ({
    meta: [
      { title: "Contact Inquiries & User Queries — FurTools Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminInquiriesPage,
});

const CATEGORY_COLORS: Record<string, string> = {
  "General Question": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "Technical Issue": "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  "Content Correction": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  "Tool Suggestion": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  "Partnership": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  "Advertising": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  "Privacy": "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  "Copyright": "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
};

const STATUS_VARIANTS: Record<
  ContactInquiry["status"],
  { label: string; badgeClass: string; icon: typeof Clock }
> = {
  unread: {
    label: "Unread / New",
    badgeClass: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    icon: AlertCircle,
  },
  read: {
    label: "In Review",
    badgeClass: "bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30",
    icon: Clock,
  },
  responded: {
    label: "Responded",
    badgeClass: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
  },
  resolved: {
    label: "Resolved",
    badgeClass: "bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30",
    icon: Check,
  },
  archived: {
    label: "Archived",
    badgeClass: "bg-muted text-muted-foreground border-border",
    icon: Inbox,
  },
};

export function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadInquiries = () => {
    const list = getLocalInquiries();
    setInquiries(list);
  };

  useEffect(() => {
    loadInquiries();
    const handler = () => loadInquiries();
    window.addEventListener("furtools_inquiries_updated", handler);
    return () => window.removeEventListener("furtools_inquiries_updated", handler);
  }, []);

  // Compute Metrics
  const metrics = useMemo(() => {
    const total = inquiries.length;
    const unread = inquiries.filter((i) => i.status === "unread").length;
    const responded = inquiries.filter((i) => i.status === "responded" || i.status === "resolved").length;
    const bugs = inquiries.filter((i) => i.category === "Technical Issue").length;
    const suggestions = inquiries.filter((i) => i.category === "Tool Suggestion").length;
    return { total, unread, responded, bugs, suggestions };
  }, [inquiries]);

  // Filtered List
  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesSearch =
        search === "" ||
        inq.name.toLowerCase().includes(search.toLowerCase()) ||
        inq.email.toLowerCase().includes(search.toLowerCase()) ||
        inq.message.toLowerCase().includes(search.toLowerCase()) ||
        inq.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || inq.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [inquiries, search, statusFilter, categoryFilter]);

  const handleOpenDetail = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes || "");
    setIsDetailOpen(true);
    if (inquiry.status === "unread") {
      updateInquiryStatus(inquiry.id, "read");
    }
  };

  const handleStatusChange = (id: string, newStatus: ContactInquiry["status"]) => {
    updateInquiryStatus(id, newStatus);
    toast.success(`Inquiry marked as ${STATUS_VARIANTS[newStatus].label}`);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  const handleSaveNotes = () => {
    if (!selectedInquiry) return;
    updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, adminNotes);
    toast.success("Admin notes saved successfully");
    setIsDetailOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user inquiry?")) {
      deleteInquiry(id);
      toast.success("Inquiry deleted");
      if (selectedInquiry?.id === id) {
        setIsDetailOpen(false);
      }
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      toast.error("No inquiries to export");
      return;
    }
    const headers = ["ID", "Date", "Name", "Email", "Category", "Status", "Message", "Admin Notes", "Page URL"];
    const rows = inquiries.map((i) => [
      i.id,
      new Date(i.created_at).toLocaleString(),
      `"${i.name.replace(/"/g, '""')}"`,
      i.email,
      `"${i.category}"`,
      i.status,
      `"${i.message.replace(/"/g, '""')}"`,
      `"${(i.admin_notes || "").replace(/"/g, '""')}"`,
      i.page_url || "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `furtools-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported inquiries to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <MessageSquare className="size-7 text-primary" />
            Contact Inquiries & User Queries
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage, respond to, and review user messages, feature suggestions, bug reports, and partnership inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 rounded-full text-xs">
            <Download className="size-3.5" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={loadInquiries} className="gap-1.5 rounded-full text-xs">
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">Total Queries</CardDescription>
            <CardTitle className="text-2xl font-bold">{metrics.total}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Lifetime user submissions
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-amber-700 dark:text-amber-400">
              New / Unread
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-900 dark:text-amber-200">
              {metrics.unread}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-amber-700/80 dark:text-amber-400/80">
            Awaiting admin review
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Responded & Resolved
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
              {metrics.responded}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
            {metrics.total > 0 ? `${Math.round((metrics.responded / metrics.total) * 100)}% resolution rate` : "0%"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">Tool Suggestions</CardDescription>
            <CardTitle className="text-2xl font-bold">{metrics.suggestions}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {metrics.bugs} technical bug reports
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search queries by name, email, keyword, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="unread">Unread / New</option>
            <option value="read">In Review</option>
            <option value="responded">Responded</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            <option value="General Question">General Question</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Content Correction">Content Correction</option>
            <option value="Tool Suggestion">Tool Suggestion</option>
            <option value="Partnership">Partnership</option>
            <option value="Advertising">Advertising</option>
            <option value="Privacy">Privacy</option>
          </select>
        </div>
      </div>

      {/* Inquiries List Table */}
      <Card className="overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Inbox className="size-12 text-muted-foreground/50 mb-3" />
            <h3 className="font-display text-base font-semibold">No inquiries found</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              {search || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search query or filters."
                : "When users submit the Contact form, their queries will instantly appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Message Preview</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((inq) => {
                  const statusCfg = STATUS_VARIANTS[inq.status] || STATUS_VARIANTS.unread;
                  const catClass = CATEGORY_COLORS[inq.category] || "bg-muted text-muted-foreground";

                  return (
                    <tr
                      key={inq.id}
                      className={`transition hover:bg-muted/30 ${
                        inq.status === "unread" ? "bg-amber-500/[0.03] font-medium" : ""
                      }`}
                    >
                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <Badge variant="outline" className={`gap-1 font-semibold text-[11px] ${statusCfg.badgeClass}`}>
                          <statusCfg.icon className="size-3" />
                          {statusCfg.label}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="p-4 whitespace-nowrap text-muted-foreground">
                        {new Date(inq.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        <span className="text-[10px] text-muted-foreground/70">
                          {new Date(inq.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </td>

                      {/* User */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-semibold text-foreground">{inq.name}</div>
                        <a
                          href={`mailto:${inq.email}?subject=Re: FurTools Inquiry - ${inq.category}`}
                          className="text-primary hover:underline text-[11px] flex items-center gap-1 mt-0.5"
                        >
                          {inq.email}
                          <ArrowUpRight className="size-2.5 opacity-70" />
                        </a>
                      </td>

                      {/* Category */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border font-medium ${catClass}`}>
                          {inq.category}
                        </span>
                      </td>

                      {/* Message Preview */}
                      <td className="p-4 max-w-xs sm:max-w-md truncate cursor-pointer" onClick={() => handleOpenDetail(inq)}>
                        <p className="truncate text-foreground/90">{inq.message}</p>
                        {inq.admin_notes && (
                          <span className="inline-block mt-0.5 text-[10px] text-purple-600 dark:text-purple-400 font-mono">
                            📝 Note: {inq.admin_notes}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetail(inq)}
                            className="h-7 px-2 text-xs rounded-full gap-1"
                          >
                            <Eye className="size-3.5" />
                            View
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs rounded-full">
                                Status <ChevronDown className="size-3 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs">
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(inq.id, "unread")}>
                                Mark as Unread
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(inq.id, "read")}>
                                Mark as In Review
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(inq.id, "responded")}>
                                Mark as Responded
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(inq.id, "resolved")}>
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(inq.id, "archived")}>
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(inq.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-3.5 mr-1.5" /> Delete Query
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Button
                            asChild
                            variant="default"
                            size="sm"
                            className="h-7 px-2.5 text-xs rounded-full gap-1"
                          >
                            <a href={`mailto:${inq.email}?subject=Re: FurTools Inquiry - ${inq.category}&body=Hi ${inq.name},%0D%0A%0D%0AThank you for reaching out to FurTools regarding: "${inq.message.slice(0, 100)}..."%0D%0A%0D%0A`}>
                              <Send className="size-3" />
                              Reply
                            </a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Inquiry Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="size-5 text-primary" />
                    Query from {selectedInquiry.name}
                  </DialogTitle>
                  <Badge variant="outline" className={STATUS_VARIANTS[selectedInquiry.status]?.badgeClass}>
                    {STATUS_VARIANTS[selectedInquiry.status]?.label}
                  </Badge>
                </div>
                <DialogDescription className="text-xs">
                  Submitted on {new Date(selectedInquiry.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* User Info Bar */}
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3 border border-border/60">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Sender</span>
                    <span className="font-semibold text-foreground text-sm">{selectedInquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Email</span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      {selectedInquiry.email}
                      <ArrowUpRight className="size-3" />
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Category</span>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${CATEGORY_COLORS[selectedInquiry.category]}`}>
                      {selectedInquiry.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Origin Page</span>
                    <span className="truncate block font-mono text-[11px] text-muted-foreground">
                      {selectedInquiry.page_url || "Direct Form"}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1.5 uppercase tracking-wider">
                    Full Message Content
                  </label>
                  <div className="rounded-xl border border-border/80 bg-card p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans shadow-inner">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Admin Internal Notes */}
                <div>
                  <label className="text-[11px] font-semibold text-foreground block mb-1.5 uppercase tracking-wider">
                    Admin Internal Notes (Private)
                  </label>
                  <Textarea
                    placeholder="Add private staff notes, resolution history, or next steps..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/60 pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="text-destructive hover:bg-destructive/10 text-xs rounded-full gap-1"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveNotes}
                    className="text-xs rounded-full"
                  >
                    Save Notes
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="text-xs rounded-full gap-1.5 font-medium"
                  >
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: FurTools Inquiry - ${selectedInquiry.category}&body=Hi ${selectedInquiry.name},%0D%0A%0D%0AThank you for reaching out to FurTools regarding your message:%0D%0A"${selectedInquiry.message}"%0D%0A%0D%0A`}
                      onClick={() => handleStatusChange(selectedInquiry.id, "responded")}
                    >
                      <Send className="size-3.5" />
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
