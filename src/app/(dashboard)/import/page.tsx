"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileSpreadsheet, CheckCircle2, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageTransition from "@/components/layout/PageTransition";
import { IMPORTED_ROWS } from "@/data/mock-dispatch";
import { Toaster, toast } from "sonner";

export default function ImportPage() {
  const [dragging, setDragging] = useState(false);
  const [imported, setImported] = useState(false);
  const [hover, setHover] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    setImported(true);
  }, []);

  const handleFileClick = useCallback(() => {
    setImported(true);
  }, []);

  const handleImport = useCallback(() => {
    toast.success("تم استيراد الشحنات بنجاح", {
      description: `تم استيراد ${IMPORTED_ROWS.filter(r => r.valid).length} شحنة من أصل ${IMPORTED_ROWS.length}`,
    });
  }, []);

  const total = IMPORTED_ROWS.length;
  const valid = IMPORTED_ROWS.filter(r => r.valid).length;
  const invalid = total - valid;

  return (
    <PageTransition>
      <Toaster
        position="top-left"
        toastOptions={{
          style: { background: "#111318", border: "1px solid #252830", color: "#F0F2F7" },
        }}
      />
      <div className="space-y-6">
        <div>
          <h1 className="font-cairo text-2xl font-bold text-text-primary">استيراد الشحنات</h1>
          <p className="text-text-secondary text-sm mt-1">رفع ملفات الشركاء لإنشاء الشحنات دفعة واحدة</p>
        </div>

        {/* Drop Zone */}
        <motion.div
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleFileClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
            dragging
              ? "border-primary bg-primary/5"
              : hover
              ? "border-primary/40 bg-surface-2/50"
              : "border-border bg-surface-2"
          }`}
        >
          <motion.div
            animate={{ y: dragging ? -8 : 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <UploadCloud className="mx-auto h-16 w-16 text-primary mb-4" />
            <p className="text-lg font-bold text-text-primary mb-2">
              اسحب وأفلت ملف الشحنات هنا أو اضغط للاستعراض
            </p>
            <p className="text-sm text-text-muted">
              الصيغ المدعومة: CSV, XLSX
            </p>
          </motion.div>
        </motion.div>

        {/* Validation Summary */}
        <AnimatePresence>
          {imported && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              {/* Summary Badges */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-success-bg border border-success/20 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">{valid} بيانات مكتملة</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-error-bg border border-error/20 px-3 py-2">
                  <XCircle className="h-4 w-4 text-error" />
                  <span className="text-sm text-error font-medium">{invalid} أخطاء</span>
                </div>
              </div>

              {/* Preview Table */}
              <div className="rounded-xl border border-border bg-surface overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الشريك</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>الجوال</TableHead>
                      <TableHead>المنطقة</TableHead>
                      <TableHead>حالة البيانات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {IMPORTED_ROWS.map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border"
                      >
                        <TableCell>
                          <span className="text-sm text-text-primary">{row.partner}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-text-primary">{row.customerName}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-inter text-sm ${row.phone ? "text-text-primary" : "text-error"}`}>
                            {row.phone || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-text-secondary">{row.district}</span>
                        </TableCell>
                        <TableCell>
                          {row.valid ? (
                            <Badge variant="success" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              بيانات مكتملة
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              رقم جوال ناقص
                            </Badge>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <FileSpreadsheet className="h-4 w-4" />
                  تم تحليل الملف — {total} شحنة مكتشفة
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" onClick={() => setImported(false)}>
                    <X className="ml-2 h-4 w-4" />
                    إلغاء
                  </Button>
                  <Button onClick={handleImport}>
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                    اعتماد واستيراد الشحنات
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
