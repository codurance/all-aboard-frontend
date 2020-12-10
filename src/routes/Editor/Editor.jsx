import './styles.scss';
import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Wrapper from '../../components/Wrapper/Wrapper';
import Header from '../../components/Header/Header';
import Toast from '../../components/Toast/Toast';
import useAuthenticatedApiCall from '../../hooks/useAuthenticatedApiCall/useAuthenticatedApiCall';

function Editor() {
  const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
  const API_ENDPOINT = 'learningpath';

  const [toastHidden, setToastHidden] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasErrorOnSubmision, setHasErrorOnSubmision] = useState(false);
  const [learningPath, setLearningPath] = useState({
    name: null,
    description: null,
  });

  let history = useHistory();

  const setNewLearningPath = (event, fieldName) => {
    const newLearningPath = { ...learningPath };
    newLearningPath[fieldName] = event.target.value;
    setLearningPath(newLearningPath);
  };

  const authenticatedApiCall = useAuthenticatedApiCall();
  async function publishLearningPath() {
    const { error } = await authenticatedApiCall(
      `${BACKEND_API_URL}/${API_ENDPOINT}`,
      {
        method: 'POST',
        auth: true,
        body: learningPath,
      }
    );
    setHasErrorOnSubmision(error !== undefined);
    setIsSubmitted(true);
  }

  const handleToasedBasedOnResult = (error) => {
    if (error) {
      setIsSubmitted(false);
      setHasErrorOnSubmision(false);
    } else {
      history.push('/learningpaths');
    }
  };

  return (
    <Fragment>
      <Header />
      <Wrapper>
        <div className="editor__container">
          <Button label={'Publish'} callback={publishLearningPath} />
          <h3>Title</h3>
          <textarea
            aria-label="learning-path-title"
            onChange={(event) => setNewLearningPath(event, 'name')}
          />
          <h3>Description</h3>
          <textarea
            aria-label="learning-path-description"
            onChange={(event) => setNewLearningPath(event, 'description')}
          />

          <Toast
            textArea={
              hasErrorOnSubmision
                ? 'error'
                : "Well done! You're very creative, wow."
            }
            variant={hasErrorOnSubmision ? 'negative' : 'positive'}
            title={hasErrorOnSubmision ? 'error' : 'Content Published'}
            isHidden={!isSubmitted}
            setHide={setIsSubmitted}
            callbackOnAction={handleToasedBasedOnResult}
          />
        </div>
      </Wrapper>
    </Fragment>
  );
}

export default Editor;
