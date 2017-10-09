import App from "../_presentation/App";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import session from "../session";

// selectors and constants
const mapStateToProps = (state) => ({
  sessionId: session.selectors.getSessionId(state),
});

const mapDispatchToProps = (dispatch) => ({
  createSession: () => dispatch(session.actions.createSession()),
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

AppContainer.propTyes = {
  databaseUrl:  PropTypes.string.isRequired,
};

export default withRouter(AppContainer);
