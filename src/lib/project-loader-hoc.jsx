import React from 'react';
import PropTypes from 'prop-types';

import analytics from './analytics';
import log from './log';
import storage from './storage';
import {connect} from 'react-redux';
import {serializeSounds, serializeCostumes} from 'scratch-vm/src/serialization/serialize-assets'

/* Higher Order Component to provide behavior for loading projects by id from
 * the window's hash (#this part in the url) or by projectId prop passed in from
 * the parent (i.e. scratch-www)
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectLoaderHOC = function (WrappedComponent) {
    class ProjectLoaderComponent extends React.Component {
        constructor (props) {
            super(props);
            this.fetchProjectId = this.fetchProjectId.bind(this);
            this.updateProject = this.updateProject.bind(this);
            this.saveProject = this.saveProject.bind(this);
            this.state = {
                projectId: null,
                projectData: null,
                fetchingProject: false,
                idCreatedFlag: false
            };
        }
        componentDidMount () {
            window.addEventListener('hashchange', this.updateProject);
            this.updateProject();
        }
        componentWillUpdate (nextProps, nextState) {
            if (this.state.projectId !== nextState.projectId) {
                if (nextState.projectId && this.fetchProjectId() !== nextState.projectId) {
                    window.location.hash = `#${nextState.projectId}`;
                }
                if (this.state.idCreatedFlag || nextState.idCreatedFlag) {
                    this.setState({idCreatedFlag: false});
                    return;
                }

                this.setState({fetchingProject: true}, () => {
                    storage
                        .load(storage.AssetType.Project, this.state.projectId, storage.DataFormat.JSON)
                        .then(projectAsset => projectAsset && this.setState({
                            projectData: projectAsset.data,
                            fetchingProject: false
                        }))
                        .catch(err => log.error(err));
                });
            }
        }
        componentWillUnmount () {
            window.removeEventListener('hashchange', this.updateProject);
        }
        fetchProjectId () {
            return window.location.hash.substring(1);
        }
        updateProject () {
            let projectId = this.props.projectId || this.fetchProjectId();
            if (projectId !== this.state.projectId) {
                if (projectId.length < 1) projectId = 0;
                this.setState({projectId: projectId});

                if (projectId !== 0) {
                    analytics.event({
                        category: 'project',
                        action: 'Load Project',
                        value: projectId,
                        nonInteraction: true
                    });
                }
            }
        }
        saveProject () {
            // save assets
            const costumeAssets = serializeCostumes(this.props.vm.runtime);
            const soundAssets = serializeSounds(this.props.vm.runtime);
            const assetPromises = [].concat(costumeAssets).concat(soundAssets).map(asset =>
                fetch('/api/prepareAssetUpload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filename: asset.fileName
                    })
                })
                    .then(res => res.json())
                    .then(({uploadUrl}) => fetch(uploadUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(asset.fileContent)
                    }))
            );

            // save project
            const data = this.props.vm.toJSON();
            const payload = {
                data,
                name: 'My fabulous project ✨'
            };
            if (this.state.projectId) {
                payload.id = this.state.projectId;
            }

            Promise.all(assetPromises)
                .then(() => fetch('/api/saveProject', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }))
                .then(res => res.json())
                .then(res => this.setState({
                    projectId: res.id,
                    idCreatedFlag: true
                }));
        }
        render () {
            const {
                projectId, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;
            if (!this.state.projectData) return null;
            return (
                <WrappedComponent
                    fetchingProject={this.state.fetchingProject}
                    projectData={this.state.projectData}
                    saveProject={this.saveProject}
                    {...componentProps}
                />
            );
        }
    }
    ProjectLoaderComponent.propTypes = {
        projectId: PropTypes.string
    };

    return connect(
        state => ({
            vm: state.vm
        }), {}
    )(ProjectLoaderComponent);
};

export {
    ProjectLoaderHOC as default
};
