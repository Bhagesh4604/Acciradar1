import React, { useState } from 'react';
import { AppView, Contact } from '../types';
import { BackIcon } from './icons';

interface ContactsScreenProps {
  setView: (view: AppView) => void;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
}

const ContactCard: React.FC<{ contact: Contact, onEdit: () => void, onDelete: () => void }> = ({ contact, onEdit, onDelete }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
            <p className="font-bold text-gray-800">{contact.name} {contact.isPrimary && <span className="text-xs text-red-500">(Primary)</span>}</p>
            <p className="text-sm text-gray-500">{contact.relation}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={onEdit} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">Edit</button>
            <button onClick={onDelete} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600">Delete</button>
        </div>
    </div>
);

const EditContactModal: React.FC<{ contact: Contact | null; onSave: (contact: Contact) => void; onClose: () => void }> = ({ contact, onSave, onClose }) => {
    const [formData, setFormData] = useState(contact || { id: Date.now(), name: '', relation: '', phone: '', isPrimary: false });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">{contact ? 'Edit Contact' : 'Add Contact'}</h3>
                <div className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded"/>
                    <input type="text" name="relation" value={formData.relation} onChange={handleChange} placeholder="Relation" className="w-full p-2 border rounded"/>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded"/>
                    <label className="flex items-center gap-2"><input type="checkbox" name="isPrimary" checked={formData.isPrimary} onChange={handleChange}/> Mark as primary contact</label>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded">Cancel</button>
                    <button onClick={() => onSave(formData)} className="bg-green-500 text-white font-semibold py-2 px-4 rounded">Save</button>
                </div>
            </div>
        </div>
    )
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ setView, contacts, setContacts }) => {
  const [isEditing, setIsEditing] = useState<Contact | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (contactToSave: Contact) => {
    // If making a new primary, demote the old one
    if (contactToSave.isPrimary) {
        contacts.forEach(c => c.isPrimary = false);
    }
    const exists = contacts.some(c => c.id === contactToSave.id);
    setContacts(exists ? contacts.map(c => c.id === contactToSave.id ? contactToSave : c) : [...contacts, contactToSave]);
    setIsEditing(null);
    setIsAdding(false);
  }

  const handleDelete = (id: number) => {
      if(window.confirm("Are you sure you want to delete this contact?")){
        setContacts(contacts.filter(c => c.id !== id));
      }
  }

  return (
    <div className="flex flex-col h-full bg-slate-100">
      { (isEditing || isAdding) && <EditContactModal contact={isEditing} onSave={handleSave} onClose={() => { setIsEditing(null); setIsAdding(false); }} />}
      <header className="flex items-center justify-between p-4 bg-white shadow-md shrink-0">
        <div className="flex items-center">
            <button onClick={() => setView(AppView.Main)} className="p-2 rounded-full hover:bg-gray-200">
              <BackIcon className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 ml-4">Emergency Contacts</h1>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg">Add New</button>
      </header>

      <div className="flex-grow p-6 space-y-4 overflow-y-auto">
        {contacts.length > 0 ? contacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} onEdit={() => setIsEditing(contact)} onDelete={() => handleDelete(contact.id)}/>
        )) : <p className="text-center text-gray-500 mt-8">No emergency contacts added yet.</p>}
      </div>
    </div>
  );
};

export default ContactsScreen;