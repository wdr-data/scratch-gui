import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import {connect} from 'react-redux';
import {openBackdropLibrary} from '../reducers/modals';
import {activateTab, COSTUMES_TAB_INDEX} from '../reducers/navigation';

import StageSelectorComponent from '../components/stage-selector/stage-selector.jsx';

import backdropLibraryContent from '../lib/libraries/backdrops.json';
import costumeLibraryContent from '../lib/libraries/costumes.json';

class StageSelector extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleSurpriseBackdrop',
            'handleEmptyBackdrop'
        ]);
    }
    handleClick (e) {
        e.preventDefault();
        this.props.onSelect(this.props.id);
    }
    handleSurpriseBackdrop () {
        const item = backdropLibraryContent[Math.floor(Math.random() * backdropLibraryContent.length)];
        const vmBackdrop = {
            name: item.name,
            rotationCenterX: item.info[0] && item.info[0] / 2,
            rotationCenterY: item.info[1] && item.info[1] / 2,
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        this.props.vm.addBackdrop(item.md5, vmBackdrop).then(() => {
            // this.props.onSetTab(1);
        });
    }
    handleEmptyBackdrop () {
        const emptyItem = costumeLibraryContent.find(item => (
            item.name === 'Empty'
        ));
        if (emptyItem) {

        }
        const vmCostume = {
            name: emptyItem.name,
            rotationCenterX: emptyItem.info[0],
            rotationCenterY: emptyItem.info[1],
            bitmapResolution: emptyItem.info.length > 2 ? emptyItem.info[2] : 1,
            skinId: null
        };

        this.props.vm.addCostume(emptyItem.md5, vmCostume).then(() => {
            this.props.onActivateTab(COSTUMES_TAB_INDEX);
        });
    }
    render () {
        const {
            /* eslint-disable no-unused-vars */
            assetId,
            id,
            onSelect,
            /* eslint-enable no-unused-vars */
            ...componentProps
        } = this.props;
        return (
            <StageSelectorComponent
                onClick={this.handleClick}
                onSurpriseBackdropClick={this.handleSurpriseBackdrop}
                onEmptyBackdropClick={this.handleEmptyBackdrop}
                {...componentProps}
            />
        );
    }
}
StageSelector.propTypes = {
    ...StageSelectorComponent.propTypes,
    id: PropTypes.string,
    onSelect: PropTypes.func
};

const mapStateToProps = (state, {assetId}) => ({
    url: assetId && state.vm.runtime.storage.get(assetId).encodeDataURI(),
    vm: state.vm
});

const mapDispatchToProps = dispatch => ({
    onNewBackdropClick: e => {
        e.preventDefault();
        dispatch(openBackdropLibrary());
    },
    onActivateTab: (t) => {
        dispatch(activateTab(t));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StageSelector);
