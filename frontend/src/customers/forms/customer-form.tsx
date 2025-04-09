import { useForm } from "@tanstack/react-form";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import type { CustomerCreate } from "~/customers/types";
import { customerSchema } from "../schemas";

type CustomerFormProps = {
  onOpenChange: (open: boolean) => void;
  onSave: (customer: CustomerCreate) => void;
  defaultValues?: CustomerCreate;
  isEditing?: boolean;
  isSaving?: boolean;
};

const defaultCustomerValues = {
  name: "",
  date_of_birth: format(new Date(), "yyyy-MM-dd"),
  gender: "male" as "male" | "female" | "OTHER",
  email: "" as string | null,
  alternate_email: "" as string | null,
  mobile_number: "",
  alternate_mobile_number: "" as string | null,
  allergies: {},
  preferences: {},
};

export function CustomerForm({
  onOpenChange,
  onSave,
  defaultValues = defaultCustomerValues,
  isEditing = false,
  isSaving = false,
}: CustomerFormProps) {
  const form = useForm({
    defaultValues: defaultValues,
    onSubmit: async ({ value }) => {
      const formattedValues = {
        ...value,
        date_of_birth: format(new Date(value.date_of_birth), "yyyy-MM-dd"),
        email: value.email === "" ? null : value.email,
        alternate_email:
          value.alternate_email === "" ? null : value.alternate_email,
        alternate_mobile_number:
          value.alternate_mobile_number === ""
            ? null
            : value.alternate_mobile_number,
      };
      console.log(formattedValues, "Customer Payload: ");
      onSave(formattedValues as CustomerCreate);
    },
    validators: {
      onChange: customerSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="md:p-4 space-y-6 py-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <form.Field
            name="name"
            children={(field) => {
              return (
                <>
                  <Label htmlFor="name">
                    Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.isBlurred && field.state.meta.errors && (
                    <span>
                      {field.state.meta.errors.map((error) => (
                        <p className="text-sm text-destructive">
                          {error?.message}
                        </p>
                      ))}
                    </span>
                  )}
                </>
              );
            }}
          />
        </div>
        <div className="space-y-2">
          <form.Field
            name="date_of_birth"
            children={(field) => {
              return (
                <>
                  <Label htmlFor="name">
                    Date of Birth<span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.state.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.state.value ? (
                          format(field.state.value, "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={
                          field.state.value
                            ? new Date(field.state.value)
                            : undefined
                        }
                        onSelect={(date) => {
                          const formattedDate = date
                            ? format(date, "yyyy-MM-dd")
                            : "";
                          return field.handleChange(formattedDate);
                        }}
                        fromYear={1947}
                        toYear={new Date().getFullYear()}
                        defaultMonth={new Date(field.state.value)}
                      />
                    </PopoverContent>
                  </Popover>
                  {field.state.meta.isBlurred && field.state.meta.errors && (
                    <span>
                      {field.state.meta.errors.map((error) => (
                        <p className="text-sm text-destructive">
                          {error?.message}
                        </p>
                      ))}
                    </span>
                  )}
                </>
              );
            }}
          />
        </div>

        <div className="space-y-2">
          <form.Field name="gender">
            {(field) => (
              <>
                <Label>
                  Gender<span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as "male" | "female" | "OTHER")
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OTHER" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
                {field.state.meta.isBlurred && field.state.meta.errors && (
                  <span>
                    {field.state.meta.errors.map((error) => (
                      <p className="text-sm text-destructive">
                        {error?.message}
                      </p>
                    ))}
                  </span>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-2">
          <form.Field name="mobile_number">
            {(field) => (
              <>
                <Label htmlFor="mobile_number">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile_number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                />
                {field.state.meta.isBlurred && field.state.meta.errors && (
                  <span>
                    {field.state.meta.errors.map((error) => (
                      <p className="text-sm text-destructive">
                        {error?.message}
                      </p>
                    ))}
                  </span>
                )}
              </>
            )}
          </form.Field>
        </div>
        <div className="space-y-2">
          <form.Field name="alternate_mobile_number">
            {(field) => (
              <>
                <Label htmlFor="alternate_mobile_number">
                  Alternate Mobile Number
                </Label>
                <Input
                  id="alternate_mobile_number"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter alternate mobile number"
                />
                {field.state.meta.isBlurred && field.state.meta.errors && (
                  <span>
                    {field.state.meta.errors.map((error) => (
                      <p className="text-sm text-destructive">
                        {error?.message}
                      </p>
                    ))}
                  </span>
                )}
              </>
            )}
          </form.Field>
        </div>

        <div className="space-y-2">
          <form.Field name="email">
            {(field) => (
              <>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter email address"
                />
                {field.state.meta.isBlurred && field.state.meta.errors && (
                  <span>
                    {field.state.meta.errors.map((error) => (
                      <p className="text-sm text-destructive">
                        {error?.message}
                      </p>
                    ))}
                  </span>
                )}
              </>
            )}
          </form.Field>
        </div>

        <div className="space-y-2">
          <form.Field name="alternate_email">
            {(field) => (
              <>
                <Label htmlFor="alternate_email">Alternate Email</Label>
                <Input
                  id="alternate_email"
                  type="email"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter email address"
                />
                {field.state.meta.isBlurred && field.state.meta.errors && (
                  <span>
                    {field.state.meta.errors.map((error) => (
                      <p className="text-sm text-destructive">
                        {error?.message}
                      </p>
                    ))}
                  </span>
                )}
              </>
            )}
          </form.Field>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button disabled={!canSubmit || isSaving} type="submit">
              {isEditing ? "Edit" : "Add"} Customer
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isSaving && <Loader2 className="animate-spin" />}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
