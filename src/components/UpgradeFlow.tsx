import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { 
  ArrowLeft,
  ArrowRight,
  FileText,
  Send,
  TrendingUp
} from "lucide-react";
import { Separator } from "./ui/separator";

interface UpgradeFlowProps {
  accountId: string;
  navigate: (route: string, params?: Record<string, string>) => void;
}

export function UpgradeFlow({ accountId, navigate }: UpgradeFlowProps) {
  const [currentConfig, setCurrentConfig] = useState({
    maxUsers: 25,
    maxDataSize: 250,
    billingCycle: "Yearly",
    modules: ["Maps", "Reporting"]
  });

  const [newConfig, setNewConfig] = useState({
    maxUsers: 50,
    maxDataSize: 500,
    billingCycle: "Yearly",
    modules: ["Maps", "Reporting", "AerialMapper"]
  });

  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const availableModules = [
    "Maps",
    "Aerial Lidar", 
    "Rail Insights",
    "AEC BIM",
    "Fiber Planner",
    "Reporting",
    "AerialMapper"
  ];

  const calculateUpgradeCost = () => {
    // Simple calculation logic
    const baseCost = newConfig.billingCycle === "Yearly" ? 10000 : 1000;
    const userCost = newConfig.maxUsers * 100;
    const dataCost = newConfig.maxDataSize * 10;
    const moduleCost = newConfig.modules.length * 500;
    return baseCost + userCost + dataCost + moduleCost;
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/accounts/manage", { id: accountId })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">Upgrade Account</h1>
          <p className="text-muted-foreground mt-1">Enhance your subscription with additional features</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Max Users</Label>
              <p className="font-medium">{currentConfig.maxUsers}</p>
            </div>
            <div>
              <Label>Max Data Size</Label>
              <p className="font-medium">{currentConfig.maxDataSize} GB</p>
            </div>
            <div>
              <Label>Billing Cycle</Label>
              <p className="font-medium">{currentConfig.billingCycle}</p>
            </div>
            <div>
              <Label>Active Modules</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {currentConfig.modules.map((module, index) => (
                  <span key={index} className="px-2 py-1 bg-muted rounded text-sm">
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>New Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxUsers">Max Users</Label>
              <Input
                id="maxUsers"
                type="number"
                value={newConfig.maxUsers}
                onChange={(e) => setNewConfig(prev => ({
                  ...prev,
                  maxUsers: parseInt(e.target.value)
                }))}
                min={currentConfig.maxUsers}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least {currentConfig.maxUsers} (no downgrades)
              </p>
            </div>
            
            <div>
              <Label htmlFor="maxDataSize">Max Data Size (GB)</Label>
              <Input
                id="maxDataSize"
                type="number"
                value={newConfig.maxDataSize}
                onChange={(e) => setNewConfig(prev => ({
                  ...prev,
                  maxDataSize: parseInt(e.target.value)
                }))}
                min={currentConfig.maxDataSize}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least {currentConfig.maxDataSize} GB (no downgrades)
              </p>
            </div>

            <div>
              <Label>Billing Cycle</Label>
              <Select 
                value={newConfig.billingCycle} 
                onValueChange={(value) => setNewConfig(prev => ({ ...prev, billingCycle: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Modules</Label>
              <div className="space-y-2 mt-2">
                {availableModules.map((module) => (
                  <div key={module} className="flex items-center space-x-2">
                    <Checkbox
                      id={module}
                      checked={newConfig.modules.includes(module)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewConfig(prev => ({
                            ...prev,
                            modules: [...prev.modules, module]
                          }));
                        } else {
                          // Don't allow removing currently active modules
                          if (!currentConfig.modules.includes(module)) {
                            setNewConfig(prev => ({
                              ...prev,
                              modules: prev.modules.filter(m => m !== module)
                            }));
                          }
                        }
                      }}
                      disabled={currentConfig.modules.includes(module)}
                    />
                    <label htmlFor={module} className="text-sm">
                      {module}
                      {currentConfig.modules.includes(module) && (
                        <span className="text-xs text-muted-foreground ml-1">(current)</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Must include all current modules (no removals)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Estimated Annual Cost</Label>
              <p className="text-2xl font-bold">{formatCurrency(calculateUpgradeCost())}</p>
            </div>
            <div>
              <Label>Additional Modules</Label>
              <p className="font-medium">
                {newConfig.modules.length - currentConfig.modules.length} new modules
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex gap-3">
            <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Quotation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Upgrade Quotation</DialogTitle>
                  <DialogDescription>
                    This will create a quotation for your account upgrade.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium">Preview</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Quotation will be generated with the new configuration and sent for approval.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowQuoteModal(false)}>
                    Cancel
                  </Button>
                  <Button>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Preview Quotation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
