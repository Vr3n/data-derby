import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { FormContainerProps } from "./types";

type FormModalProps<T> = FormContainerProps<T>;

function ModalFormContainer<T>({
  title,
  subtitle,
  FormComponent,
  open = false,
  onOpenChange,
  onSave,
}: FormModalProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        <FormComponent onOpenChange={onOpenChange} onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
}

export default ModalFormContainer;
