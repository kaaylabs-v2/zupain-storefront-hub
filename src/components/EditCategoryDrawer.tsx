
import React, { useState, useRef, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ChevronRight, ChevronDown, Plus, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCategoryMutations } from '@/hooks/useCategoryMutations';
import { CreateCategoryInput, UpdateCategoryInput, Category } from '@/utils/graphql';
import { toast } from '@/hooks/use-toast';

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

interface UploadedImage {
  id: string;
  file: File | null; // null for existing images
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  isExisting?: boolean; // Flag to identify existing images
}

const EditCategoryDrawer = ({ isOpen, onClose, category, onSave }: EditCategoryDrawerProps) => {
  const { currentPalette } = useTheme();
  const { createCategory, updateCategory, loading, error } = useCategoryMutations();
  
  const [categoryName, setCategoryName] = useState(category?.name || '');
  const [isBannerExpanded, setIsBannerExpanded] = useState(false);
  const [bannerTitle, setBannerTitle] = useState(category?.banner_title || '');
  const [bannerDescription, setBannerDescription] = useState(category?.banner_description || '');
  const [isAttributesExpanded, setIsAttributesExpanded] = useState(false);
  const [isSEOExpanded, setIsSEOExpanded] = useState(false);
  
  // Image upload state
  const [categoryImage, setCategoryImage] = useState<UploadedImage | null>(null);
  const [bannerImage, setBannerImage] = useState<UploadedImage | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isBannerDragOver, setIsBannerDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  
  // Attributes state
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeDataType, setNewAttributeDataType] = useState('');
  
  // SEO state
  const [seoPageTitle, setSeoPageTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');
  const [seoCategoryUrlHandle, setSeoCategoryUrlHandle] = useState('');

  // Determine if this is create or edit mode
  const isEditMode = !!category;

  React.useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setBannerTitle(category.banner_title || '');
      setBannerDescription(category.banner_description || '');
      setSeoPageTitle(category.seo_page_title || '');
      setSeoMetaDescription(category.seo_meta_description || '');
      setSeoCategoryUrlHandle(category.seo_url_handle || '');
      
      // Set existing images if available
      if (category.image) {
        setCategoryImage({
          id: 'existing-category',
          file: null,
          preview: category.image,
          uploading: false,
          uploaded: true,
          url: category.image,
          isExisting: true
        });
      }
    } else {
      // Reset form for create mode
      setCategoryName('');
      setBannerTitle('');
      setBannerDescription('');
      setAttributes([]);
      setSeoPageTitle('');
      setSeoMetaDescription('');
      setSeoCategoryUrlHandle('');
      setCategoryImage(null);
      setBannerImage(null);
    }
  }, [category]);

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 2MB';
    }
    
    return null;
  };

  // Upload file to S3 and get URL
  const uploadToS3 = async (file: File, type: 'category' | 'banner'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('folder', 'categories'); // Organize files in S3
    
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('/api/upload-to-s3', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image to S3');
    }
    
    const result = await response.json();
    return result.s3Url; // Return the S3 URL
  };

  // Handle file selection (no immediate upload)
  const handleFileSelect = useCallback(async (file: File, type: 'category' | 'banner') => {
    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    const imageId = Date.now().toString();
    const preview = URL.createObjectURL(file);
    
    const newImage: UploadedImage = {
      id: imageId,
      file,
      preview,
      uploading: false, // Will be true during save
      uploaded: false,
      isExisting: false
    };

    if (type === 'category') {
      // Clean up old preview URL if exists
      if (categoryImage?.preview && !categoryImage.isExisting) {
        URL.revokeObjectURL(categoryImage.preview);
      }
      setCategoryImage(newImage);
    } else {
      // Clean up old preview URL if exists
      if (bannerImage?.preview && !bannerImage.isExisting) {
        URL.revokeObjectURL(bannerImage.preview);
      }
      setBannerImage(newImage);
    }

    toast({
      title: "File selected",
      description: "Image will be uploaded when you save the category",
    });
  }, [categoryImage, bannerImage]);

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'category' | 'banner') => {
    console.log("handleFileInputChange", event);
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file, type);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent, type: 'category' | 'banner') => {
    e.preventDefault();
    if (type === 'category') {
      setIsDragOver(true);
    } else {
      setIsBannerDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, type: 'category' | 'banner') => {
    e.preventDefault();
    if (type === 'category') {
      setIsDragOver(false);
    } else {
      setIsBannerDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: 'category' | 'banner') => {
    e.preventDefault();
    
    if (type === 'category') {
      setIsDragOver(false);
    } else {
      setIsBannerDragOver(false);
    }
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile, type);
    } else {
      toast({
        title: "Invalid file",
        description: "Please drop a valid image file",
        variant: "destructive",
      });
    }
  }, [handleFileSelect]);

  // Remove image
  const removeImage = (type: 'category' | 'banner') => {
    if (type === 'category') {
      if (categoryImage?.preview && !categoryImage.isExisting) {
        URL.revokeObjectURL(categoryImage.preview);
      }
      setCategoryImage(null);
    } else {
      if (bannerImage?.preview && !bannerImage.isExisting) {
        URL.revokeObjectURL(bannerImage.preview);
      }
      setBannerImage(null);
    }
  };

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      if (categoryImage?.preview && !categoryImage.isExisting) {
        URL.revokeObjectURL(categoryImage.preview);
      }
      if (bannerImage?.preview && !bannerImage.isExisting) {
        URL.revokeObjectURL(bannerImage.preview);
      }
    };
  }, [categoryImage, bannerImage]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!categoryName.trim()) {
      errors.push('Category name is required');
    }

    if (categoryName.length > 100) {
      errors.push('Category name must be less than 100 characters');
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    try {
      // Set uploading state for new images
      if (categoryImage?.file && !categoryImage.isExisting) {
        setCategoryImage(prev => prev ? { ...prev, uploading: true } : null);
      }
      if (bannerImage?.file && !bannerImage.isExisting) {
        setBannerImage(prev => prev ? { ...prev, uploading: true } : null);
      }

      let categoryImageUrl: string | undefined;
      let bannerImageUrl: string | undefined;

      // Upload new files to S3 first
      if (categoryImage?.file && !categoryImage.isExisting) {
        categoryImageUrl = await uploadToS3(categoryImage.file, 'category');
      } else if (categoryImage?.isExisting && categoryImage.url) {
        categoryImageUrl = categoryImage.url; // Keep existing URL
      }

      if (bannerImage?.file && !bannerImage.isExisting) {
        bannerImageUrl = await uploadToS3(bannerImage.file, 'banner');
      } else if (bannerImage?.isExisting && bannerImage.url) {
        bannerImageUrl = bannerImage.url; // Keep existing URL
      }

      if (isEditMode && category) {
        // Update existing category
        const updateInput: UpdateCategoryInput = {
          category_name: categoryName,
          banner_title: bannerTitle,
          banner_description: bannerDescription,
          seo_page_title: seoPageTitle,
          seo_meta_description: seoMetaDescription,
          seo_url_handle: seoCategoryUrlHandle,
        };

        // Add S3 URLs
        if (categoryImageUrl) {
          updateInput.banner_image = categoryImageUrl;
        }
        if (bannerImageUrl) {
          updateInput.banner_image = bannerImageUrl;
        }

        const updatedCategory = await updateCategory(category.id, updateInput);
        if (updatedCategory) {
          onSave(updatedCategory);
          toast({
            title: "Success",
            description: "Category updated successfully",
          });
          onClose();
        }
      } else {
        // Create new category
        const createInput: CreateCategoryInput = {
          category_name: categoryName,
          is_active: true,
          banner_title: bannerTitle,
          banner_description: bannerDescription,
          seo_page_title: seoPageTitle,
          seo_meta_description: seoMetaDescription,
          seo_url_handle: seoCategoryUrlHandle,
        };

        // Add S3 URLs
        if (categoryImageUrl) {
          createInput.banner_image = categoryImageUrl;
        }
        if (bannerImageUrl) {
          createInput.banner_image = bannerImageUrl;
        }

        console.log("createInput", createInput);
        const newCategory = await createCategory(createInput);
        if (newCategory) {
          onSave(newCategory);
          toast({
            title: "Success",
            description: "Category created successfully",
          });
          onClose();
        }
      }
    } catch (err) {
      // Reset uploading state on error
      if (categoryImage?.file && !categoryImage.isExisting) {
        setCategoryImage(prev => prev ? { ...prev, uploading: false } : null);
      }
      if (bannerImage?.file && !bannerImage.isExisting) {
        setBannerImage(prev => prev ? { ...prev, uploading: false } : null);
      }

      toast({
        title: "Error",
        description: error || "Failed to save category",
        variant: "destructive",
      });
    }
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
    
    // Clean up object URLs before resetting
    if (categoryImage?.preview && !categoryImage.isExisting) {
      URL.revokeObjectURL(categoryImage.preview);
    }
    if (bannerImage?.preview && !bannerImage.isExisting) {
      URL.revokeObjectURL(bannerImage.preview);
    }
    
    setCategoryImage(null);
    setBannerImage(null);
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
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? 'Edit Category' : 'Add Category'}
            </h2>
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
                  
                  {categoryImage ? (
                    <div className="relative">
                      <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden">
                        <img 
                          src={categoryImage.preview} 
                          alt="Category preview" 
                          className="w-full h-48 object-cover"
                        />
                        {categoryImage.uploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="flex items-center space-x-2 text-white">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Uploading...</span>
                            </div>
                          </div>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 w-8 h-8 p-0"
                          onClick={() => removeImage('category')}
                          disabled={categoryImage.uploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        {categoryImage.isExisting && (
                          <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            Current Image
                          </div>
                        )}
                        {categoryImage.file && !categoryImage.isExisting && (
                          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Ready to Upload
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                        isDragOver 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 bg-gray-50'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => handleDragOver(e, 'category')}
                      onDragLeave={(e) => handleDragLeave(e, 'category')}
                      onDrop={(e) => handleDrop(e, 'category')}
                    >
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
                          <p className="text-blue-600">Will upload when you save</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileInputChange(e, 'category')}
                  />
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
                      
                      {bannerImage ? (
                        <div className="relative">
                          <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={bannerImage.preview} 
                              alt="Banner preview" 
                              className="w-full h-32 object-cover"
                            />
                            {bannerImage.uploading && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="flex items-center space-x-2 text-white">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Uploading...</span>
                                </div>
                              </div>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 w-6 h-6 p-0"
                              onClick={() => removeImage('banner')}
                              disabled={bannerImage.uploading}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            {bannerImage.isExisting && (
                              <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                Current Image
                              </div>
                            )}
                            {bannerImage.file && !bannerImage.isExisting && (
                              <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Ready to Upload
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`border-2 border-dashed rounded-lg p-6 text-center bg-white cursor-pointer transition-colors ${
                            isBannerDragOver 
                              ? 'border-blue-400 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => bannerFileInputRef.current?.click()}
                          onDragOver={(e) => handleDragOver(e, 'banner')}
                          onDragLeave={(e) => handleDragLeave(e, 'banner')}
                          onDrop={(e) => handleDrop(e, 'banner')}
                        >
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 mb-1">Drag & drop files or Browse</p>
                          <p className="text-xs text-gray-500">1920 x 1080</p>
                          <p className="text-xs text-blue-600 mt-1">Image aspect ratio for better fit</p>
                          <p className="text-xs text-red-600">Max file size: Image 2MB</p>
                          <p className="text-xs text-blue-600">Will upload when you save</p>
                        </div>
                      )}
                      
                      <input
                        ref={bannerFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileInputChange(e, 'banner')}
                      />
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
              disabled={loading || (categoryImage?.uploading) || (bannerImage?.uploading)}
              className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading || (categoryImage?.uploading) || (bannerImage?.uploading)}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading || (categoryImage?.uploading) || (bannerImage?.uploading) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {(categoryImage?.uploading) || (bannerImage?.uploading) ? 'Uploading...' : (isEditMode ? 'Updating...' : 'Creating...')}
                </>
              ) : (
                isEditMode ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditCategoryDrawer;
