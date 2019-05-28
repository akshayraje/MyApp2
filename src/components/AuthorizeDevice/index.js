import { connect } from 'react-redux';

import AuthorizeDevice from './AuthorizeDevice';
import { setLoading } from '../../actions';

const mapStateToProps = ({ isLoading }) => ({ isLoading });
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchLoadingState: (isLoading) => dispatch(setLoading(isLoading))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorizeDevice);
