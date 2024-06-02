import React, { useState } from "react";

interface CitizenProfilePageProps {
  initialData: {
    username: string;
    email: string;
    name: string;
    surname: string;
    age: number;
    password: string;
    cellphone: string;
    municipality: string;
  };
  onSubmit: (formData: any) => void;
}

const EditCitizenProfile: React.FC<CitizenProfilePageProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Surname:
        <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Age:
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Cellphone:
        <input type="text" name="cellphone" value={formData.cellphone} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Municipality:
        <input type="text" name="municipality" value={formData.municipality} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Save</button>
    </form>
  );
};

export default EditCitizenProfile;
