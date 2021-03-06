import React, { Fragment, useEffect, useState } from 'react';
import './styles.scss';
import Header from '../../components/Header/Header';
import Wrapper from '../../components/Wrapper/Wrapper';
import useGetLearningPathDetails from '../../hooks/useGetLearninPaths/useGetLearningPathDetails';
import { useGoogleAuth } from '../../components/Login/GoogleAuthProvider';
import PropTypes from 'prop-types';
import Tile from '../../components/Tile/Tile';
import RedirectButton from '../../components/Buttons/RedirectButton/RedirectButton';
import DataNotFound from '../../components/DataNotFound/DataNotFound';

const LearningPathDetails = function ({ match }) {
  const learningPathId = match.params.id;
  const [data, setData] = useState();
  const [error, setError] = useState();
  const { isSignedIn } = useGoogleAuth();
  const getLearningPathDetails = useGetLearningPathDetails();

  const fetchData = async () => {
    if (!isSignedIn) return;
    const { error, data } = await getLearningPathDetails(learningPathId);
    data && setData(data);
    error && setError(error);
  };

  useEffect(() => {
    fetchData();
  }, [isSignedIn]);

  const listTopics = (topics) =>
    topics.map((topic) => {
      return (
        <Tile
          title={topic.name}
          textArea={topic.description}
          key={topic.id}
          button={
            <RedirectButton
              redirectUrl={`/learningpath/${learningPathId}/topic/${topic.id}`}
              label="See topic"
              variant="big"
            />
          }
        />
      );
    });

  return (
    <Fragment>
      <Header title={data ? data.name : null} />
      <Wrapper>
        <Fragment>
          {data && (
            <Fragment>
              <section className={'learningpath'}>
                <p>{data.description}</p>
              </section>
              {listTopics(data.topics)}
            </Fragment>
          )}
          {error && <DataNotFound type={'learning path'}></DataNotFound>}
        </Fragment>
      </Wrapper>
    </Fragment>
  );
};

export default LearningPathDetails;

LearningPathDetails.propTypes = {
  match: PropTypes.object,
};
