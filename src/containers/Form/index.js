import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); })

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);

  // Valeurs initiales des données du formulaire
  const initialState = { firstName: "", lastName: "", email: "", message: "", type: "Personel", };
  
  // Valeurs du formulaire qui vont être modifiées 
  const [formData , setFormData] = useState(initialState)

  // Permet de récupérer les valeurs que l'ont saisis
  const handleChange = (field , value) => {
    setFormData((prev) => ({...prev, [field]: value})) 
  }

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setSending(true);
      // We try to call mockContactApi
      try {
        await mockContactApi();
        setSending(false);
        onSuccess(); // Appeler le callback onSuccess après une réussite

        // Après l'envoie, on revient à l'état initial 
        setFormData(initialState) 
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );
  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field placeholder="écrivez le nom ici" label="Nom" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)}/>
          <Field placeholder="écrivez le prénom ici" label="Prénom" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)}/>
          <Select
            selection={["Personel", "Entreprise"]}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            value={formData.type}
            onChange={(value) => handleChange("type", value)}
          />
          <Field placeholder="" label="Email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;
