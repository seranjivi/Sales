import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import DateField from './DateField';
import RegionDropdown from './RegionDropdown';
import CountryDropdown from './CountryDropdown';
import { Plus, Trash2, Building2, X } from 'lucide-react';

const ClientForm = ({ client, onClose }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    contact_email: '',
    website: '',
    industry: '',
    customer_type: 'Direct Customer',
    gst_tax_id: '',
    address: '',
    country: '',
    region: '',
    account_owner: '',
    client_status: 'Active',
    notes: '',
    contact_persons: [{ name: '', email: '', phone: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (client) {
      setFormData({
        client_name: client.client_name || '',
        contact_email: client.contact_email || '',
        website: client.website || '',
        industry: client.industry || '',
        customer_type: client.customer_type || 'Direct Customer',
        gst_tax_id: client.gst_tax_id || '',
        address: client.address || '',
        country: client.country || '',
        region: client.region || '',
        account_owner: client.account_owner || '',
        client_status: client.client_status || 'Active',
        notes: client.notes || '',
        contact_persons: client.contact_persons && client.contact_persons.length > 0 
          ? client.contact_persons 
          : [{ name: '', email: '', phone: '' }]
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.contact_persons];
    updatedContacts[index][field] = value;
    setFormData(prev => ({ ...prev, contact_persons: updatedContacts }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contact_persons: [...prev.contact_persons, { name: '', email: '', phone: '' }]
    }));
  };

  const removeContact = (index) => {
    if (formData.contact_persons.length > 1) {
      const updatedContacts = formData.contact_persons.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, contact_persons: updatedContacts }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Client name is required';
    }
    
    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Primary email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email';
    }
    
    if (!formData.customer_type) {
      newErrors.customer_type = 'Customer type is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.account_owner) {
      newErrors.account_owner = 'Account owner is required';
    }
    
    if (!formData.client_status) {
      newErrors.client_status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        // Keep primary email as contact_email for backward compatibility
        contact_persons: formData.contact_persons.filter(contact => 
          contact.name || contact.email || contact.phone
        )
      };

      if (client) {
        await api.put(`/clients/${client.id}`, submitData);
        toast.success('Client updated successfully');
      } else {
        await api.post('/clients', submitData);
        toast.success('Client created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Client form error:', error);
      toast.error(error.response?.data?.detail || 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-[#0A2A43]" />
          <h2 className="text-2xl font-semibold text-[#0A2A43]">
            {client ? 'EDIT CLIENT' : 'NEW CLIENT'}
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1 - Basic Client Details */}
        <div>
          <h3 className="text-lg font-medium text-[#0A2A43] mb-4">Basic Client Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                className={errors.client_name ? 'border-red-500' : ''}
                data-testid="client-name-input"
              />
              {errors.client_name && (
                <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="contact_email">Primary Email *</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                className={errors.contact_email ? 'border-red-500' : ''}
                data-testid="client-email-input"
              />
              {errors.contact_email && (
                <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                data-testid="client-website-input"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Technology, Healthcare"
                data-testid="client-industry-input"
              />
            </div>
            <div>
              <Label htmlFor="customer_type">Customer Type *</Label>
              <Select
                value={formData.customer_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, customer_type: value }))}
                data-testid="client-customer-type-select"
              >
                <SelectTrigger className={errors.customer_type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select customer type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direct Customer">Direct Customer</SelectItem>
                  <SelectItem value="Partner">Partner</SelectItem>
                  <SelectItem value="Reseller">Reseller</SelectItem>
                </SelectContent>
              </Select>
              {errors.customer_type && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_type}</p>
              )}
            </div>
            <div>
              <Label htmlFor="gst_tax_id">GST / Tax ID</Label>
              <Input
                id="gst_tax_id"
                name="gst_tax_id"
                value={formData.gst_tax_id}
                onChange={handleChange}
                placeholder="e.g. 27AAAPL1234C1ZV"
                data-testid="client-gst-input"
              />
            </div>
          </div>
        </div>

        {/* Section 2 - Contact Persons */}
        <div>
          <h3 className="text-lg font-medium text-[#0A2A43] mb-4">Contact Persons</h3>
          <div className="space-y-4">
            {formData.contact_persons.map((contact, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div>
                  <Label htmlFor={`contact_name_${index}`}>Name</Label>
                  <Input
                    id={`contact_name_${index}`}
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    placeholder="Contact name"
                    data-testid={`contact-name-${index}`}
                  />
                </div>
                <div>
                  <Label htmlFor={`contact_email_${index}`}>Email</Label>
                  <Input
                    id={`contact_email_${index}`}
                    type="email"
                    value={contact.email}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    placeholder="contact@example.com"
                    data-testid={`contact-email-${index}`}
                  />
                </div>
                <div>
                  <Label htmlFor={`contact_phone_${index}`}>Phone</Label>
                  <Input
                    id={`contact_phone_${index}`}
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                    data-testid={`contact-phone-${index}`}
                  />
                </div>
                <div className="flex items-end">
                  {formData.contact_persons.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeContact(index)}
                      className="text-red-500 hover:text-red-700"
                      data-testid={`remove-contact-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addContact}
              className="flex items-center gap-2"
              data-testid="add-contact-button"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Section 3 - Address Details */}
        <div>
          <h3 className="text-lg font-medium text-[#0A2A43] mb-4">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="123 Main St, Suite 100, City, State 12345"
                data-testid="client-address-input"
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <CountryDropdown
                value={formData.country}
                onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                region={formData.region}
                placeholder="Select country..."
                required={true}
                showRequiredIndicator={true}
                className={errors.country ? 'border-red-500' : ''}
                data-testid="client-country-dropdown"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
            <div>
              <Label htmlFor="region">Region / State</Label>
              <RegionDropdown
                value={formData.region}
                onChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
                placeholder="Select region..."
                data-testid="client-region-dropdown"
              />
            </div>
          </div>
        </div>

        {/* Section 4 - Account & Status */}
        <div>
          <h3 className="text-lg font-medium text-[#0A2A43] mb-4">Account & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account_owner">Account Owner *</Label>
              <Select
                value={formData.account_owner}
                onValueChange={(value) => setFormData(prev => ({ ...prev, account_owner: value }))}
                data-testid="client-account-owner-select"
              >
                <SelectTrigger className={errors.account_owner ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select account owner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Thilakraj">Thilakraj</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              {errors.account_owner && (
                <p className="text-red-500 text-sm mt-1">{errors.account_owner}</p>
              )}
            </div>
            <div>
              <Label htmlFor="client_status">Status *</Label>
              <Select
                value={formData.client_status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, client_status: value }))}
                data-testid="client-status-select"
              >
                <SelectTrigger className={errors.client_status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.client_status && (
                <p className="text-red-500 text-sm mt-1">{errors.client_status}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 5 - Notes / Description */}
        <div>
          <h3 className="text-lg font-medium text-[#0A2A43] mb-4">Notes / Description</h3>
          <div>
            <Label htmlFor="notes">Notes / Description</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Additional notes about this client..."
              data-testid="client-notes-input"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            data-testid="client-form-cancel"
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            data-testid="client-form-submit"
            className="bg-[#0A2A43] hover:bg-[#0A2A43]/90 px-6"
          >
            {loading ? 'Saving...' : client ? 'Update Client' : 'Save Client'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
