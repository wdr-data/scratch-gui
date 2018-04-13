import classNames from 'classnames';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';

import {openFeedbackForm, openImportInfo} from '../../reducers/modals';

import styles from './menu-bar.css';

import mystuffIcon from './icon--mystuff.png';
import profileIcon from './icon--profile.png';
import feedbackIcon from './icon--feedback.svg';
import communityIcon from './icon--see-community.svg';
import dropdownCaret from '../language-selector/dropdown-caret.svg';
import scratchLogo from './scratch-logo.svg';

const MenuBar = props => (
    <Box
        className={classNames({
            [styles.menuBar]: true
        })}
    >
        <div className={styles.mainMenu}>
            <div className={styles.fileGroup}>
                <div className={classNames(styles.logoWrapper, styles.menuItem)}>
                    <img
                        alt="Scratch"
                        className={styles.scratchLogo}
                        draggable={false}
                        src={scratchLogo}
                    />
                </div>
                <div className={classNames(styles.menuItem)}>
                    <ComingSoonTooltip
                        className={styles.comingSoon}
                        place="bottom"
                        tooltipClassName={styles.comingSoonTooltip}
                        tooltipId="file-menu"
                    >
                        <div className={classNames(styles.fileMenu)}>File</div>
                    </ComingSoonTooltip>
                </div>
                <div className={classNames(styles.menuItem)}>
                    <ComingSoonTooltip
                        className={styles.comingSoon}
                        place="bottom"
                        tooltipClassName={styles.comingSoonTooltip}
                        tooltipId="edit-menu"
                    >
                        <div className={classNames(styles.editMenu)}>Edit</div>
                    </ComingSoonTooltip>
                </div>
            </div>
            <div className={classNames(styles.divider)} />
            <div className={classNames(styles.menuItem)}>
                <ComingSoonTooltip
                    className={styles.comingSoon}
                    place="bottom"
                    tooltipClassName={styles.comingSoonTooltip}
                    tooltipId="title-field"
                >
                    <input
                        disabled
                        className={classNames(styles.titleField)}
                        placeholder="Untitled-1"
                    />
                </ComingSoonTooltip>
            </div>
            <div className={classNames(styles.menuItem)}>
                <ComingSoonTooltip
                    className={styles.comingSoon}
                    place="bottom"
                    tooltipClassName={styles.comingSoonTooltip}
                    tooltipId="share-button"
                >
                    <Button className={classNames(styles.shareButton)}>
                        <FormattedMessage
                            defaultMessage="Share"
                            description="Label for project share button"
                            id="gui.menuBar.share"
                        />
                    </Button>
                </ComingSoonTooltip>
            </div>
            <div className={classNames(styles.menuItem)}>
                <button
                    className={styles.viewProjectButton}
                    title="viewproject"
                    onClick={props.onImportProject}
                >
                    Import
                </button>
            </div>
        </div>
    </Box>
);

MenuBar.propTypes = {
    onGiveFeedback: PropTypes.func.isRequired,
    onImportProject: PropTypes.func
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onGiveFeedback: () => {
        dispatch(openFeedbackForm());
    },
    onImportProject: () => {
        dispatch(openImportInfo());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar);
