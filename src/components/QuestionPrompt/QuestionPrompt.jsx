import React, { Fragment, useEffect, useState } from 'react';
import { apiCall } from '../../utils/apiCall';
import Button from '../Button/Button';
import Tile from '../Tile/Tile';
import Toast from '../Toast/Toast';
import './styles.scss';
import { useGoogleAuth } from '../Login/GoogleAuthProvider';
const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

const TOAST_ERROR_TITLE = 'Oh No! (but it works on my machine)';
const TOAST_SUCESS_TITLE = "You've been most helpful! Thank you!";
const TOAST_ERROR_TEXT =
  "Things happened, that wasn't supposed to happen. Please drop us a line on #allaboard slack channel, to let us know you've encountered an issue.";
const TOAST_SUCESS_TEXT =
  "These aren't the droids we're looking for. You can go about your business. Move along, move along.";

const QuestionPrompt = () => {
  const [textArea, setTextArea] = useState('');
  const [disableSubmission, setdisableSubmission] = useState(true);
  const [toastTextArea, setToastTextArea] = useState('');
  const [toastTitle, setToastTitle] = useState('');
  const [toastHidden, setToastHidden] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { fetchWithRefresh, isSignedIn, googleUser } = useGoogleAuth();

  useEffect(() => {
    setdisableSubmission(textArea === '' || !isSignedIn);
  }, [textArea, setdisableSubmission, isSignedIn]);

  const setStatesAfterSubmit = (error) => {
    setIsSubmitted(true);
    setToastHidden(false);
    setToastTitle(error ? TOAST_ERROR_TITLE : TOAST_SUCESS_TITLE);
    setToastTextArea(error ? TOAST_ERROR_TEXT : TOAST_SUCESS_TEXT);
  };

  async function submit() {
    if (!googleUser) {
      return;
    }

    await fetchWithRefresh();
    const email = googleUser.profileObj.email;

    const { error } = await apiCall(`${BACKEND_API_URL}/survey`, {
      method: 'POST',
      auth: true,
      body: { email: email, preference: textArea },
    });

    setStatesAfterSubmit(error);
  }

  return (
    <Fragment>
      {isSubmitted ? null : (
        <Tile
          title={'How do you organise and make use of your learning resources?'}
          textArea={
            <textarea
              defaultValue={textArea}
              maxLength={1500}
              onChange={(event) => {
                setTextArea(event.target.value);
              }}
              placeholder={
                '(...) for example, I go to a Wikipedia page, download all articles listed in the reference section and read them one-by-one while making notes in my Moleskine notebook.'
              }
            ></textarea>
          }
          button={
            <Button
              isDisabled={disableSubmission}
              label={'Submit'}
              variant={'big'}
              callback={submit}
            />
          }
        />
      )}

      <Toast
        textArea={toastTextArea}
        title={toastTitle}
        isHidden={toastHidden}
        setHide={setToastHidden}
      />
    </Fragment>
  );
};

export default QuestionPrompt;
