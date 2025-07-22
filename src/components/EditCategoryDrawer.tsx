
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ChevronRight, ChevronDown, Plus, Trash2, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Category {
  id: string;
  name: string;
  status: boolean;
  products: number;
  image: string;
}

interface EditCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (category: Category) => void;
}

interface Attribute {
  id: string;
  name: string;
  dataType: string;
}

const EditCategoryDrawer = ({ isOpen, onClose, category, onSave }: EditCategoryDrawerProps) => {
  const { currentPalette } = useTheme();
  const [categoryName, setCategoryName] = useState(category?.name || '');
  const [isBannerExpanded, setIsBannerExpanded] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');
  const [isAttributesExpanded, setIsAttributesExpanded] = useState(false);
  const [isSEOExpanded, setIsSEOExpanded] = useState(false);
  
  // Attributes state
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeDataType, setNewAttributeDataType] = useState('');
  
  // SEO state
  const [seoPageTitle, setSeoPageTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');
  const [seoCategoryUrlHandle, setSeoCategoryUrlHandle] = useState('');

  React.useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  const handleSave = () => {
    if (category) {
      onSave({
        ...category,
        name: categoryName
      });
    }
    onClose();
  };

  const handleCancel = () => {
    setCategoryName(category?.name || '');
    setBannerTitle('');
    setBannerDescription('');
    setIsBannerExpanded(false);
    setIsAttributesExpanded(false);
    setIsSEOExpanded(false);
    setAttributes([]);
    setNewAttributeName('');
    setNewAttributeDataType('');
    setSeoPageTitle('');
    setSeoMetaDescription('');
    setSeoCategoryUrlHandle('');
    onClose();
  };

  const handleAddAttribute = () => {
    if (newAttributeName && newAttributeDataType) {
      const newAttribute: Attribute = {
        id: Date.now().toString(),
        name: newAttributeName,
        dataType: newAttributeDataType
      };
      setAttributes([...attributes, newAttribute]);
      setNewAttributeName('');
      setNewAttributeDataType('');
    }
  };

  const handleRemoveAttribute = (id: string) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-gray-50 p-0 flex flex-col" hideCloseButton>
        {/* Custom Header - Fixed */}
        <div className="flex items-center justify-between p-6 bg-white border-b flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">Edit Category</h2>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Main Category Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="text-white font-medium">Add category</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <Label htmlFor="category-name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Categories *
                  </Label>
                  <Input
                    id="category-name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter category name"
                  />
                </div>

                {/* Modern Image Upload */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Category Image
                  </Label>
                  <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors bg-gray-50">
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Drag & drop files or Browse</p>
                        <p className="text-xs text-gray-500 mt-1">300 x 300</p>
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="text-orange-600">Image aspect ratio for better fit</p>
                        <p className="text-red-600">Max file size 2MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              {/* Add Banner Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsBannerExpanded(!isBannerExpanded)}
                >
                  <span className="font-medium text-gray-900">Add Banner</span>
                  {isBannerExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {isBannerExpanded && (
                  <div className="border-t bg-gray-50 p-6 space-y-6">
                    {/* Banner Image Upload */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Banner Image
                      </Label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-white">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">Drag & drop files or Browse</p>
                        <p className="text-xs text-gray-500">1920 x 1080</p>
                        <p className="text-xs text-blue-600 mt-1">Image aspect ratio for better fit</p>
                        <p className="text-xs text-red-600">Max file size: Image 2MB</p>
                      </div>
                    </div>

                    {/* Banner Title */}
                    <div>
                      <Label htmlFor="banner-title" className="text-sm font-medium text-gray-700 mb-2 block">
                        Banner Title
                      </Label>
                      <Input
                        id="banner-title"
                        placeholder="Enter Banner Title"
                        value={bannerTitle}
                        onChange={(e) => setBannerTitle(e.target.value)}
                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Banner Description */}
                    <div>
                      <Label htmlFor="banner-description" className="text-sm font-medium text-gray-700 mb-2 block">
                        Banner Description
                      </Label>
                      <Textarea
                        id="banner-description"
                        placeholder="Enter Banner Description"
                        value={bannerDescription}
                        onChange={(e) => setBannerDescription(e.target.value)}
                        className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Add Attributes Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsAttributesExpanded(!isAttributesExpanded)}
                >
                  <span className="font-medium text-gray-900">Add Attributes</span>
                  {isAttributesExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {isAttributesExpanded && (
                  <div className="border-t bg-gray-50 p-6 space-y-6">
                    {/* Add Attribute Form */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Add Attributes *
                        </Label>
                        <Input
                          placeholder="Enter Attributes"
                          value={newAttributeName}
                          onChange={(e) => setNewAttributeName(e.target.value)}
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Data Type
                        </Label>
                        <Select value={newAttributeDataType} onValueChange={setNewAttributeDataType}>
                          <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select data type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleAddAttribute}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Attribute
                    </Button>

                    {/* Attributes List */}
                    {attributes.length > 0 && (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
                          <span>Attributes</span>
                          <span>Data Type</span>
                          <span>Actions</span>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {attributes.map((attribute) => (
                            <div key={attribute.id} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm items-center">
                              <span className="text-gray-900">{attribute.name}</span>
                              <span className="text-gray-600 capitalize">{attribute.dataType}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAttribute(attribute.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto w-fit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {attributes.length === 0 && (
                      <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-sm">No attributes added yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* SEO Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsSEOExpanded(!isSEOExpanded)}
                >
                  <span className="font-medium text-gray-900">SEO</span>
                  {isSEOExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {isSEOExpanded && (
                  <div className="border-t bg-gray-50 p-6 space-y-6">
                    {/* Page Title */}
                    <div>
                      <Label htmlFor="seo-page-title" className="text-sm font-medium text-gray-700 mb-2 block">
                        Page Title
                      </Label>
                      <div className="text-xs text-blue-600 mb-3 p-3 bg-blue-50 rounded-lg border">
                        https://blameless.zupain.com/product-list?categoryId=57891c0a-c815-4607-b075-0db138c5beba
                      </div>
                      <Input
                        id="seo-page-title"
                        placeholder="Page Title"
                        value={seoPageTitle}
                        onChange={(e) => setSeoPageTitle(e.target.value)}
                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Meta Description */}
                    <div>
                      <Label htmlFor="seo-meta-description" className="text-sm font-medium text-gray-700 mb-2 block">
                        Meta Description
                      </Label>
                      <Textarea
                        id="seo-meta-description"
                        placeholder="Meta Description"
                        value={seoMetaDescription}
                        onChange={(e) => setSeoMetaDescription(e.target.value)}
                        className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Category URL Handle */}
                    <div>
                      <Label htmlFor="seo-url-handle" className="text-sm font-medium text-gray-700 mb-2 block">
                        Category URL Handle
                      </Label>
                      <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <span className="inline-flex items-center px-3 text-xs text-blue-600 bg-gray-50 border-r border-gray-300">
                          https://blameless.zupain.com/product-list?categoryId=
                        </span>
                        <Input
                          id="seo-url-handle"
                          placeholder="url-handle"
                          value={seoCategoryUrlHandle}
                          onChange={(e) => setSeoCategoryUrlHandle(e.target.value)}
                          className="border-0 focus:ring-0 h-11"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Action Buttons */}
        <div className="border-t bg-white p-6 flex-shrink-0">
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditCategoryDrawer;
