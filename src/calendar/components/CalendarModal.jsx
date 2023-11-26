import { useEffect, useMemo, useState } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useCalendarStore, useUiStore } from '../../hooks';
import { getEnvVariables } from '../../helpers';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

if (getEnvVariables().VITE_MODE !== 'test') {
    Modal.setAppElement('#root');
}

export const CalendarModal = () => {

    const { activeEvent, startSavingEvent } = useCalendarStore();
    const { isDateModalOpen, closeDateModal } = useUiStore();

    const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 1),
    });

    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.title.length > 0)
            ? ''
            : 'is-invalid';

    }, [formValues.title, formSubmitted]);

    useEffect(() => {
        if (activeEvent !== null) {
            setFormValues({ ...activeEvent });
        }

    }, [activeEvent]);


    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        });
    };

    const onDateChanged = (event, changing) => {
        setFormValues({
            ...formValues,
            [changing]: event
        });
    };

    const onCloseModal = () => {
        closeDateModal();
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);

        const difference = differenceInSeconds(formValues.end, formValues.start);

        if (isNaN(difference) || difference <= 0) {
            Swal.fire('Invalid Dates', 'Please check the entered dates.', 'error');
            return;
        }

        if (formValues.title.length <= 0) return;

        await startSavingEvent(formValues);
        closeDateModal();
        setFormSubmitted(false);
    };

    setTimeout(() => {
        const datepickerWrappers = document.querySelectorAll('.react-datepicker-wrapper');
        datepickerWrappers.forEach(wrapper => {
            wrapper.classList.add('form-control');
        });

    }, 0);

    return (
        <Modal
            isOpen={ isDateModalOpen }
            onRequestClose={ onCloseModal }
            style={ customStyles }
            className='modal'
            overlayClassName='modal-fondo'
            closeTimeoutMS={ 200 }
        >
            <h1> New Event </h1>
            <hr />
            <form className="container" onSubmit={ onSubmit }>

                <div className="form-group mb-2">
                    <label>Start Date & Time</label>
                    <DatePicker
                        minDate={ formValues.start }
                        selected={ formValues.start }
                        onChange={ (event) => onDateChanged(event, 'start') }
                        className="form-control"
                        dateFormat='Pp'
                        showTimeSelect
                    />
                </div>

                <div className="form-group mb-2">
                    <label>End Date & Time</label>
                    <DatePicker
                        selected={ formValues.end }
                        onChange={ (event) => onDateChanged(event, 'end') }
                        className="form-control"
                        dateFormat='Pp'
                        showTimeSelect
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Title & Notes</label>
                    <input
                        type="text"
                        className={ `form-control ${titleClass}` }
                        placeholder="Event Title"
                        name="title"
                        autoComplete="off"
                        value={ formValues.title }
                        onChange={ onInputChanged }
                    />
                    <small id="emailHelp" className="form-text text-muted">A short description</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notes"
                        rows="5"
                        name="notes"
                        value={ formValues.notes }
                        onChange={ onInputChanged }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Additional information</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Save</span>
                </button>

            </form>
        </Modal>
    );
};
