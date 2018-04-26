import AudioEngine from 'scratch-audio';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import {openExtensionLibrary, closeSaveProject} from '../reducers/modals';
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

import AppStateHOC from '../lib/app-state-hoc.jsx';
import ProjectLoaderHOC from '../lib/project-loader-hoc.jsx';
import vmListenerHOC from '../lib/vm-listener-hoc.jsx';

import GUIComponent from '../components/gui/gui.jsx';
import {toggleLayoutMode} from '../reducers/layout-mode';

class GUI extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            loadingError: false,
            errorMessage: ''
        };
        this.onSaveModalError = (msg) => this.setState({saveModalError: msg});
    }
    componentDidMount () {
        this.audioEngine = new AudioEngine();
        this.props.vm.attachAudioEngine(this.audioEngine);
        this.props.vm.loadProject(this.props.projectData)
            .then(() => {
                this.setState({loading: false}, () => {
                    this.props.vm.setCompatibilityMode(true);
                    this.props.vm.start();
                });
            })
            .catch(e => {
                // Need to catch this error and update component state so that
                // error page gets rendered if project failed to load
                this.setState({loadingError: true, errorMessage: e});
            });
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.projectData !== nextProps.projectData) {
            this.setState({loading: true}, () => {
                this.props.vm.loadProject(nextProps.projectData)
                    .then(() => {
                        this.setState({loading: false});
                    })
                    .catch(e => {
                        // Need to catch this error and update component state so that
                        // error page gets rendered if project failed to load
                        this.setState({loadingError: true, errorMessage: e});
                    });
            });
        }
    }
    componentWillUnmount () {
        this.props.vm.stopAll();
    }
    render () {
        if (this.state.loadingError) throw new Error(`Failed to load project: ${this.state.errorMessage}`);
        const {
            children,
            fetchingProject,
            loadingStateVisible,
            projectData, // eslint-disable-line no-unused-vars
            vm,
            ...componentProps
        } = this.props;
        return (
            <GUIComponent
                loading={fetchingProject || this.state.loading || loadingStateVisible}
                vm={vm}
                onSaveModalError={this.onSaveModalError}
                saveModalError={this.state.saveModalError}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    ...GUIComponent.propTypes,
    fetchingProject: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    previewInfoVisible: PropTypes.bool,
    projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    vm: PropTypes.instanceOf(VM)
};

GUI.defaultProps = GUIComponent.defaultProps;

const mapStateToProps = state => ({
    activeTabIndex: state.editorTab.activeTabIndex,
    blocksTabVisible: state.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
    costumesTabVisible: state.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
    loadingStateVisible: state.modals.loadingProject,
    previewInfoVisible: state.modals.previewInfo,
    saveProjectVisible: state.modals.saveProject,
    soundsTabVisible: state.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
    layoutmode: state.layoutMode,
    projectName: state.project.name
});

const mapDispatchToProps = dispatch => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onActivateTab: tab => dispatch(activateTab(tab)),
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onLayoutModeClick: () => dispatch(toggleLayoutMode()),
    onSaveModalClose: () => dispatch(closeSaveProject()),
});

const ConnectedGUI = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUI);

export default AppStateHOC(ProjectLoaderHOC(vmListenerHOC(ConnectedGUI)));
