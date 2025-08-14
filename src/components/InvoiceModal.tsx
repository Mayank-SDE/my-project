import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Plus, Trash2, Eye, Send, Download, FileText, Receipt } from "lucide-react";
import { toast } from "sonner";

interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  type: "QUOTATION" | "INVOICE";
  number: string;
  currency: string;
  amountSubtotal: number;
  taxAmount: number;
  amountTotal: number;
  accountId?: string;
  subscriptionRequestId?: string;
  items: InvoiceItem[];
  customer: {
    name: string;
    email: string;
    address: string;
    gstin: string;
  };
  dueDate: string | null;
  notes: string;
}

interface InvoiceModalProps {
  type: "QUOTATION" | "INVOICE";
  accountId?: string;
  subscriptionRequestId?: string;
  trigger: React.ReactNode;
  onGenerate?: (invoice: InvoiceData) => void;
}

export function InvoiceModal({ type, accountId, subscriptionRequestId, trigger, onGenerate }: InvoiceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form state
  const [currency, setCurrency] = useState("INR");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      name: "Professional Plan - Monthly",
      description: "Access to all features with monthly billing",
      quantity: 1,
      unitPrice: 2999,
      total: 2999
    }
  ]);
  const [taxRate, setTaxRate] = useState(18); // GST rate
  const [notes, setNotes] = useState("");

  // Customer details (would typically be fetched based on accountId)
  const [customerData] = useState({
    name: "Acme Corporation Pvt Ltd",
    email: "admin@acme.com",
    address: "123 Business District, Tech City, Mumbai 400001",
    gstin: "27ABCDE1234F1Z5"
  });

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  const generateInvoice = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to generate invoice/quotation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const invoiceData = {
        type,
        number: type === "QUOTATION" ? `QTN-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` : `INV-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        currency,
        amountSubtotal: subtotal,
        taxAmount,
        amountTotal: total,
        accountId,
        subscriptionRequestId,
        items,
        customer: customerData,
        dueDate: dueDate || null,
        notes
      };

      setShowPreview(true);
      onGenerate?.(invoiceData);
      toast.success(`${type.toLowerCase()} generated successfully!`);
    } catch {
      toast.error(`Failed to generate ${type.toLowerCase()}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = () => {
    toast.success(`${type.toLowerCase()} sent to ${customerData.email}`);
    setIsOpen(false);
  };

  const downloadPDF = () => {
    toast.success(`${type.toLowerCase()} PDF downloaded`);
  };

  const PreviewContent = () => (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">S2M Technologies</h1>
          <p className="text-gray-600 mt-1">Advanced Subscription Management Solutions</p>
          <div className="text-sm text-gray-500 mt-2">
            <p>Tech Tower, 5th Floor, Bangalore 560001</p>
            <p>Email: billing@s2m.tech | Phone: +91-80-12345678</p>
            <p>GSTIN: 29ABCDE1234F1Z5</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800">{type}</h2>
          <p className="text-lg font-semibold text-blue-600">
            {type === "QUOTATION" ? `QTN-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` : `INV-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Date: {new Date().toLocaleDateString('en-IN')}
          </p>
          {dueDate && (
            <p className="text-sm text-gray-500">
              Due Date: {new Date(dueDate).toLocaleDateString('en-IN')}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Customer Details */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Bill To:</h3>
          <div className="text-sm text-gray-600">
            <p className="font-semibold">{customerData.name}</p>
            <p>{customerData.address}</p>
            <p>Email: {customerData.email}</p>
            <p>GSTIN: {customerData.gstin}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">From:</h3>
          <div className="text-sm text-gray-600">
            <p className="font-semibold">S2M Technologies Pvt Ltd</p>
            <p>Tech Tower, 5th Floor</p>
            <p>Bangalore, Karnataka 560001</p>
            <p>GSTIN: 29ABCDE1234F1Z5</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Items Table */}
      <div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 text-gray-800">Item</th>
              <th className="text-center py-2 text-gray-800">Qty</th>
              <th className="text-right py-2 text-gray-800">Unit Price</th>
              <th className="text-right py-2 text-gray-800">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                </td>
                <td className="text-center py-3">{item.quantity}</td>
                <td className="text-right py-3">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                <td className="text-right py-3">₹{item.total.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-80 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST ({taxRate}%):</span>
            <span>₹{taxAmount.toLocaleString('en-IN')}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Notes:</h3>
          <p className="text-sm text-gray-600">{notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>Thank you for your business!</p>
        <p className="mt-1">For any queries, please contact us at support@s2m.tech</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "QUOTATION" ? <FileText className="h-5 w-5" /> : <Receipt className="h-5 w-5" />}
            Generate {type.toLowerCase()}
          </DialogTitle>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6">
            {/* Basic Details */}
            <Card>
              <CardHeader>
                <CardTitle>Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {type === "INVOICE" && (
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Items</CardTitle>
                  <Button onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <Label>Item Name</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Item name"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label>Qty</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label>Total</Label>
                      <div className="h-10 flex items-center font-semibold">
                        ₹{item.total.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tax and Totals */}
            <Card>
              <CardHeader>
                <CardTitle>Tax & Totals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({taxRate}%):</span>
                    <span className="font-semibold">₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes or terms..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={generateInvoice} disabled={isGenerating}>
                <Eye className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Preview"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview Actions */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Preview Mode</Badge>
                <span className="text-sm text-gray-600">
                  Review before sending to customer
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Edit
                </Button>
                <Button variant="outline" onClick={downloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={sendEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="border rounded-lg bg-white">
              <PreviewContent />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
