import { ButtonJsx, Form, Input, Textarea } from "../../components/index.js";

const ContactForm = () => {
  return (
    <Form>
      <Input placeholder="Ingrese Nombres" />
      <Input type="email" placeholder="Ingrese email" />
      <Input type="numbre" placeholder="Ingrese teléfono" />
      <Textarea />
      <ButtonJsx>Enviar</ButtonJsx>
    </Form>
  );
};

export default ContactForm;
