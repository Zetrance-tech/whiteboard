import { Button } from "@/components/ui/button";
import { Table, Pen, Bot, Box, BookOpen, Image, Highlighter, Edit3, Feather } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Circle, 
  Minus, 
  Type,
  Trash2,
  Undo,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Download,
  Eraser,
  Triangle,
  Star,
  Diamond,
  Pentagon,
  Hexagon,
  Shapes,
  ChevronDown,
  Sun,
  Moon,
  PenTool
} from "lucide-react";
import { Tool, PenType } from "./Canvas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useCallback, useMemo } from "react";

// Predefined colors with semantic names for better maintainability
const PREDEFINED_COLORS = [
  { value: "#1e40af", name: "Blue" },
  { value: "#dc2626", name: "Red" },
  { value: "#059669", name: "Green" },
  { value: "#d97706", name: "Orange" },
  { value: "#7c3aed", name: "Purple" },
  { value: "#be185d", name: "Pink" },
  { value: "#0891b2", name: "Cyan" },
  { value: "#65a30d", name: "Lime" },
  { value: "#000000", name: "Black" },
  { value: "#6b7280", name: "Gray" }
];

// Color Picker Component
interface ColorPickerSectionProps {
  activeColor: string;
  onColorChange: (color: string) => void;
}

const ColorPickerSection: React.FC<ColorPickerSectionProps> = ({ activeColor, onColorChange }) => {
  // Memoize the color change handler for each color to prevent unnecessary re-renders
  const getColorChangeHandler = useCallback((color: string) => {
    return () => onColorChange(color);
  }, [onColorChange]);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-800 dark:text-white">Color</h4>
      <div className="grid grid-cols-5 gap-2">
        {PREDEFINED_COLORS.map((color) => (
          <button
            key={color.value}
            className={cn(
              "w-8 h-8 rounded-md border-2 transition-all duration-200",
              activeColor === color.value
                ? "border-blue-500 ring-2 ring-blue-400"
                : "border-gray-200 hover:border-blue-400 dark:border-[#4a5361]"
            )}
            style={{ backgroundColor: color.value }}
            onClick={getColorChangeHandler(color.value)}
            aria-label={`Select ${color.name} color`}
            title={color.name}
          />
        ))}
      </div>
      <input
        type="color"
        value={activeColor}
        onChange={(e) => onColorChange(e.target.value)}
        className={cn(
          "w-full h-8 rounded-md cursor-pointer border border-gray-200",
          "bg-gray-50 dark:bg-[#363d47] dark:border-none"
        )}
        aria-label="Custom color picker"
      />
    </div>
  );
};

// Stroke Width Component
interface StrokeWidthSectionProps {
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
}

const StrokeWidthSection: React.FC<StrokeWidthSectionProps> = ({ strokeWidth, onStrokeWidthChange }) => {
  // Handle stroke width change with validation
  const handleStrokeWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // Ensure the value is within valid range
    if (!isNaN(value) && value >= 1 && value <= 15) {
      onStrokeWidthChange(value);
    }
  }, [onStrokeWidthChange]);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-800 dark:text-white">Stroke Width</h4>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={1}
          max={15}
          value={strokeWidth}
          onChange={handleStrokeWidthChange}
          className={cn(
            "flex-1 h-2 rounded-lg appearance-none cursor-pointer",
            "bg-gray-100 dark:bg-[#363d47]"
          )}
          aria-label="Adjust stroke width"
          aria-valuemin={1}
          aria-valuemax={15}
          aria-valuenow={strokeWidth}
        />
        <span className="text-gray-700 dark:text-white text-sm w-8 text-center">{strokeWidth}px</span>
      </div>
    </div>
  );
};

const ICON_SHORTCUTS: Record<string, string> = {
  select: '1',
  rectangle: 'r',
  diamond: 'd',
  circle: 'c',
  line: 'l',
  triangle: '3',
  draw: '2',
  text: 't',
  eraser: '0',
  star: 's',
  pentagon: 'p',
  hexagon: 'h',
  marker: 'm',
  highlighter: 'h',
  calligraphy: 'g',
  pencil: 'p',
};

// Pen types with their properties
const PEN_TYPES = [
  {
    id: "pencil" as PenType,
    icon: Pencil,
    label: "Pencil",
    tooltip: "Standard pencil for precise drawing",
    opacity: 1.0,
    width: 2
  },
  {
    id: "marker" as PenType,
    icon: PenTool,
    label: "Marker",
    tooltip: "Thicker marker pen for bold strokes",
    opacity: 0.9,
    width: 5
  },
  {
    id: "highlighter" as PenType,
    icon: Highlighter,
    label: "Highlighter",
    tooltip: "Transparent highlighter for emphasis",
    opacity: 0.4,
    width: 15
  },
  {
    id: "calligraphy" as PenType,
    icon: Feather,
    label: "Calligraphy",
    tooltip: "Calligraphy pen for elegant writing",
    opacity: 1.0,
    width: 8
  },
];

interface ToolbarProps {
  activeTool: Tool;
  onToolClick: (tool: Tool) => void;
  onClear: () => void;
  onUndo: () => void;
  onZoom: (direction: 'in' | 'out') => void;
  onAddImage: () => void;
  onShowAI: () => void;
  onShowDigitalHuman: () => void;
  onShowModel: () => void;
  onShowBook: () => void;
  onShowPTable: () => void;
  onShowExport: () => void;
  activeColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  canvas: any;
  activePenType?: PenType;
  onPenTypeChange?: (penType: PenType) => void;
}

interface ToolButtonProps {
  isActive?: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  colorClass?: string;
  tooltip?: string;
}

const ToolButton: React.FC<ToolButtonProps & { shortcut?: string }> = ({ 
  isActive, 
  onClick, 
  icon: Icon,  
  colorClass = "blue", 
  shortcut
}) => (
  <HoverCard openDelay={300}>
    <HoverCardTrigger asChild>
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={onClick}
        className={cn(
          "h-10 w-10 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative",
          isActive 
            ? `bg-${colorClass}-100 text-${colorClass}-700 hover:bg-${colorClass}-200 dark:bg-${colorClass}-600 dark:text-white dark:hover:bg-${colorClass}-700 shadow-lg shadow-${colorClass}-500/20 dark:shadow-${colorClass}-500/10` 
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 hover:shadow-md"
        )}
      >
        <Icon className="h-5 w-5 transform transition-transform duration-200 group-hover:scale-110" />
        {shortcut && (
          <span className="absolute -top-1 -right-1 bg-gray-800 dark:bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
            {shortcut}
          </span>
        )}
      </Button>
    </HoverCardTrigger>
  </HoverCard>
);

export const Toolbar = ({
  activeTool,
  onToolClick,
  onClear,
  onUndo,
  onZoom,
  onShowAI,
  onAddImage,
  onShowDigitalHuman,
  onShowModel,
  onShowBook,
  onShowPTable,
  onShowExport,
  activeColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  canvas,
  activePenType = "pencil",
  onPenTypeChange
}: ToolbarProps) => {
  const { theme, toggleTheme } = useTheme();

  console.log("Toolbar activeTool:", activeTool);
  const basicTools = [
    {
      id: "select" as Tool,
      icon: MousePointer,
      label: "Select",
      tooltip: "Click and drag to select, move, and resize objects on the canvas"
    },
    {
      id: "draw" as Tool,
      icon: Edit3,
      label: "Draw",
      tooltip: "Freehand drawing tool. Click and drag to create custom shapes"
    },
    {
      id: "text" as Tool,
      icon: Type,
      label: "Text",
      tooltip: "Add text to your diagram. Double-click existing text to edit"
    },
    {
      id: "eraser" as Tool,
      icon: Eraser,
      label: "Reality Eraser",
      tooltip: "Erase any part of your drawing by clicking and dragging"
    },
  ];

  const shapes = [
    { id: "rectangle" as Tool, icon: Square, label: "Rectangle" },
    { id: "circle" as Tool, icon: Circle, label: "Circle" },
    { id: "line" as Tool, icon: Minus, label: "Line" },
    { id: "triangle" as Tool, icon: Triangle, label: "Triangle" },
    { id: "diamond" as Tool, icon: Diamond, label: "Diamond" },
    { id: "pentagon" as Tool, icon: Pentagon, label: "Pentagon" },
    { id: "hexagon" as Tool, icon: Hexagon, label: "Hexagon" },
    { id: "star" as Tool, icon: Star, label: "Star" },
  ];

  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row items-center rounded-2xl px-2 sm:px-4 py-2 mt-2 shadow-lg",
        "bg-white/90 dark:bg-[#363d47]",
        "border border-gray-200 dark:border-none",
        "backdrop-blur-sm"
      )}
    >
      {/* Toolbar buttons */}
      <div className="flex flex-row items-center gap-2">
        {basicTools.slice(0, 2).map((tool) => (
          <ToolButton
            key={tool.id}
            isActive={activeTool === tool.id}
            onClick={() => onToolClick(tool.id)}
            icon={tool.icon}
            label={tool.label}
            tooltip={tool.tooltip}
            colorClass="blue"
            shortcut={ICON_SHORTCUTS[tool.id]}
          />
        ))}

        {/* Pen Types Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={activeTool === "draw" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center relative",
                "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#4a5361] dark:text-white dark:hover:bg-[#5a6473]",
                activeTool === "draw" && "ring-2 ring-blue-400"
              )}
            >
              <Pen className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gray-800 dark:bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                ▼
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className={cn(
              "border border-gray-200 rounded-xl shadow-xl mt-2 p-2 min-w-[180px]",
              "bg-white text-gray-800 dark:bg-[#23272f] dark:text-white dark:border-none"
            )}
          >
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white">Pen Types</h4>
              <div className="grid grid-cols-2 gap-2">
                {PEN_TYPES.map((pen) => (
                  <DropdownMenuItem
                    key={pen.id}
                    onClick={() => {
                      onToolClick("draw");
                      onPenTypeChange?.(pen.id);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 px-2 py-2 rounded-lg cursor-pointer relative",
                      "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-[#363d47]",
                      activeTool === "draw" && activePenType === pen.id
                        ? "bg-blue-50 ring-2 ring-blue-400 dark:bg-[#2d3340]"
                        : ""
                    )}
                  >
                    <pen.icon className="h-5 w-5" />
                    <span className="text-xs">{pen.label}</span>
                    {ICON_SHORTCUTS[pen.id] && (
                      <span className="absolute -top-1 -right-1 bg-gray-800 dark:bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                        {ICON_SHORTCUTS[pen.id]}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
              
              <Separator className="bg-gray-200 dark:bg-[#4a5361]" />
              
              {/* Color Picker Section */}
              <ColorPickerSection
                activeColor={activeColor}
                onColorChange={onColorChange}
              />

              <Separator className="bg-gray-200 dark:bg-[#4a5361]" />

              {/* Stroke Width Section */}
              <StrokeWidthSection
                strokeWidth={strokeWidth}
                onStrokeWidthChange={onStrokeWidthChange}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>



        {/* Shapes Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={shapes.some(s => s.id === activeTool) ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center relative",
                "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#4a5361] dark:text-white dark:hover:bg-[#5a6473]",
                shapes.some(s => s.id === activeTool) && "ring-2 ring-blue-400"
              )}
            >
              <Shapes className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gray-800 dark:bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                ▼
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className={cn(
              "border border-gray-200 rounded-xl shadow-xl mt-2 p-2 min-w-[180px]",
              "bg-white text-gray-800 dark:bg-[#23272f] dark:text-white dark:border-none"
            )}
          >
            <div className="grid grid-cols-4 gap-2">
              {shapes.map((shape) => (
                <DropdownMenuItem
                  key={shape.id}
                  onClick={() => onToolClick(shape.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg cursor-pointer relative",
                    "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-[#363d47]",
                    activeTool === shape.id
                      ? "bg-blue-50 ring-2 ring-blue-400 dark:bg-[#2d3340]"
                      : ""
                  )}
                >
                  <shape.icon className="h-5 w-5" />
                  <span className="text-xs">{shape.label}</span>
                  {ICON_SHORTCUTS[shape.id] && (
                    <span className="absolute -top-1 -right-1 bg-gray-800 dark:bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                      {ICON_SHORTCUTS[shape.id]}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {basicTools.slice(2).map((tool) => (
          <ToolButton
            key={tool.id}
            isActive={activeTool === tool.id}
            onClick={() => onToolClick(tool.id)}
            icon={tool.icon}
            label={tool.label}
            tooltip={tool.tooltip}
            colorClass="blue"
            shortcut={ICON_SHORTCUTS[tool.id]}
          />
        ))}
      </div>

      
      {/* Spacer */}
      <div className="flex-1" />
      {/* Action buttons */}
      <div className="flex flex-row items-center gap-2 mt-2 sm:mt-0">
        <ToolButton onClick={onUndo} icon={Undo} label="Undo" colorClass="blue" />
        <ToolButton onClick={onClear} icon={Trash2} label="Clear" colorClass="red" />
        <ToolButton onClick={() => onZoom('in')} icon={ZoomIn} label="Zoom In" colorClass="blue" />
        <ToolButton onClick={() => onZoom('out')} icon={ZoomOut} label="Zoom Out" colorClass="blue" />
        {/* <ToolButton onClick={onShowExport} icon={Download} label="Export" colorClass="green" /> */}
        {/* <ToolButton onClick={onAddImage} icon={Image} label="Add Image" colorClass="green" /> */}
        {/* <ToolButton onClick={onShowAI} icon={Sparkles} label="AI Assistant" colorClass="purple" />
        <ToolButton onClick={onShowDigitalHuman} icon={Bot} label="AI Teacher" colorClass="purple" />
        <ToolButton onClick={onShowModel} icon={Box} label="3D Model" colorClass="purple" />
        <ToolButton onClick={onShowBook} icon={BookOpen} label="book" colorClass="green" />
         */}
       <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-10 rounded-xl",
                "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#23272f] dark:text-white dark:hover:bg-[#363d47]"
              )}
            >
              <Sparkles className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          {/* AI Assistant Section */}

          <DropdownMenuContent
            align="end"
            className={cn(
              "border border-gray-200 rounded-xl shadow-xl mt-2 p-4 min-w-[280px]",
              "bg-white text-gray-800 dark:bg-[#23272f] dark:text-white dark:border-none"
            )}
          >
            <div className="space-y-4">             
              {/* AI Assistant Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-800 dark:text-white">AI Services</h4>
                             
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowAI}
                  className={cn(
                    "w-full justify-start gap-2",
                    "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-[#363d47]"
                  )}
                >
                  <Sparkles className="h-4 w-3" />
                  <span>Open AI Assistant</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowAI}
                  className={cn(
                    "w-full justify-start gap-2",
                    "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-[#363d47]"
                  )}
                >
                  <Bot className="h-4 w-3" />
                  <span>Digital Human</span>
                </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowModel}
                className={cn(
                "w-full justify-start gap-2",
                "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-[#363d47]"
                 )}
               >
             <Box className="h-4 w-3" />
             <span>3D Model</span>
            </Button>

            

            <Button
            variant="ghost"
            size="sm"
            onClick={onShowBook} // ✅ Updated handler name
            className={cn(
            "w-full justify-start gap-2",
            "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-[#363d47]"
             )}
            >
           <BookOpen className="h-4 w-4" />
            <span>Book</span>
           </Button>

            <Button
            variant="ghost"
            size="sm"
            onClick={onShowPTable} // ✅ Updated handler name
            className={cn(
            "w-full justify-start gap-2",
            "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-[#363d47]"
             )}
            >
           <Table className="h-4 w-4" />
            <span>Periodic Table</span>
           </Button>


              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>




        {/* Settings popover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-10 rounded-xl",
                "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#23272f] dark:text-white dark:hover:bg-[#363d47]"
              )}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(
              "border border-gray-200 rounded-xl shadow-xl mt-2 p-4 min-w-[280px]",
              "bg-white text-gray-800 dark:bg-[#23272f] dark:text-white dark:border-none"
            )}
          >
            <div className="space-y-4">
              
              {/* Theme Toggle Section */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-800 dark:text-white">Theme</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={cn(
                    "w-full justify-start gap-2",
                    "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-[#363d47]"
                  )}
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  )}
                </Button>
                <Separator className="bg-gray-200 dark:bg-[#4a5361]" />
                <Button
            variant="ghost"
            size="sm"
            onClick={onShowExport} // ✅ Updated handler name
            className={cn(
            "w-full justify-start gap-2",
            "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-[#363d47]"
             )}
            >
           <Download className="h-4 w-4" />
            <span>Save Canvas</span>
           </Button>
              </div>

            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

