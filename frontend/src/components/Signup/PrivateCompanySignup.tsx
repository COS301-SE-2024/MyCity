import React, { FormEvent, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function ServiceProviderSignup() {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    const companyname = form.get('company-name');
    const number = form.get('contact-number');
    const email = form.get('email');
    const logo = form.get('company-logo');
    console.log("company name:", companyname);
    console.log("company logo:", logo);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-12">
      <form data-testid="service-provider-signup-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">
        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Company Name <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="company-name"
          autoComplete="Teska"
          placeholder="Tesla"
          required
        />

        <div>
          <label className="font-semibold text-medium block mb-[0.20em]">
            Company Logo
          </label>
          {logoPreview && (
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <input
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            type="file"
            name="company-logo"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Contact Number <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="contact-number"
          autoComplete="new-number"
          placeholder="0116543211"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Email<span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="email"
          name="email"
          autoComplete="new-email"
          placeholder="example@mail.com"
          required
        />

        <Button name="submit" className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
