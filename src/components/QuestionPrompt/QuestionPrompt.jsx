import React, { Fragment, useEffect, useState } from 'react';
import { apiCall } from '../../utils/apiCall';
import Button from '../Button/Button';
import Tile from '../Tile/Tile';
import Toast from '../Toast/Toast';
import './styles.scss';

const QuestionPrompt = () => {
  const [textArea, setTextArea] = useState('');
  const [disableSubmission, setdisableSubmission] = useState(true);
  const [toastTextArea, setToastTextArea] = useState('');
  const [toastTitle, setToastTitle] = useState('');
  const [toastHidden, setToastHidden] = useState(true);

  useEffect(() => {
    setdisableSubmission(textArea === '');
  }, [textArea, setdisableSubmission]);

  async function submit() {
    const email = localStorage.getItem('email');
    if (email) {
      const { error } = await apiCall(
        'http://all-aboard-api-dev.eu-west-2.elasticbeanstalk.com/survey',
        {
          method: 'POST',
          auth: true,
          body: { email: email, preference: textArea },
        }
      );
      setToastHidden(false);
      setToastTitle(
        error
          ? 'Oh No! (but it works on my machine)'
          : "You've been most helpful! Thank you!"
      );
      setToastTextArea(
        error
          ? 'Things happened, that weren’t supposed to happen. Please drop us a line on #allaboard slack channel, to let us know you’ve encountered an issue.'
          : "These aren't the doids we're looking for. You can go about your business. Move along, move along."
      );
    }
  }

  return (
    <Fragment>
      <Tile
        title={'How do you organise and make use of your learning resources?'}
        textArea={
          <textarea
            defaultValue={textArea}
            onChange={(event) => {
              setTextArea(event.target.value);
            }}
            placeholder={'Answer here...'}
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

      <Toast
        textArea={toastTextArea}
        title={toastTitle}
        isHidden={toastHidden}
      />
    </Fragment>
  );
};

export default QuestionPrompt;
