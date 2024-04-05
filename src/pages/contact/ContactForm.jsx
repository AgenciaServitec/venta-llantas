import { useForm } from "react-hook-form";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="item-wrapper">
          <label htmlFor="input-fullname">Nombres y apellidos</label>
          <input
            id="input-fullname"
            {...register("fullName", { required: true })}
            className={errors.fullName && "error-item"}
          />
        </div>
        <div className="item-wrapper">
          <label htmlFor="input-email">Email</label>
          <input
            id="input-email"
            {...register("email", {
              required: true,
              pattern:
                /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/i,
            })}
            className={errors.email && "error-item"}
          />
        </div>
        <div className="item-wrapper">
          <label htmlFor="input-phone-number">Teléfono</label>
          <input
            type="number"
            id="input-phone-number"
            {...register("phoneNumber", { required: true, min: 9 })}
            className={errors.phoneNumber && "error-item"}
          />
        </div>
        <div className="item-wrapper">
          <label htmlFor="textarea-message">Mensaje</label>
          <textarea
            id="textarea-message"
            cols="30"
            rows="7"
            {...register("message")}
            className={errors.message && "error-item"}
          ></textarea>
        </div>
        <input type="submit" value="Enviar" className="btn-submit" />
      </form>
    </div>
  );
};

export default ContactForm;
