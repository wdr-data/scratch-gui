import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import ReactTooltip from 'react-tooltip';

import styles from './asset-button.css';

class AssetButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClosePopover',
            'handleToggleOpenState',
            'clickDelayerFactory'
        ]);
        this.state = {
            isOpen: false,
            forceHide: false
        };
    }
    handleClosePopover () {
        this.closeTimeoutId = setTimeout(() => {
            this.setState({isOpen: false});
            this.closeTimeoutId = null;
        }, 300);
    }
    handleToggleOpenState () {
        if (this.closeTimeoutId) {
            clearTimeout(this.closeTimeoutId);
            this.closeTimeoutId = null;
        } else {
            // console.log('toggling: next-' + nextOpenState + ' force-' + nextOpenState ? false : this.state.forceHide)
            this.setState({
                isOpen: true,
                forceHide: false
            });
        }
    }
    clickDelayerFactory (fn) {
        return (event) => {
            this.setState({forceHide: true, isOpen: false}, () => {
                if (fn) fn(event);
                setTimeout(() => this.setState({forceHide: false}))
            });
        }
    }
    render () {
        const {
            className,
            img: mainImg,
            title: mainTitle,
            moreButtons,
            onClick
        } = this.props;

        const mainTooltipId = `tooltip-${Math.random()}`;

        return (
            <div
                className={classNames(styles.menuContainer, className, {
                    [styles.expanded]: this.state.isOpen,
                    [styles.forceHidden]: this.state.forceHide
                })}
                onMouseEnter={this.handleToggleOpenState}
                onMouseLeave={this.handleClosePopover}
            >
                <button
                    className={classNames(styles.container)}
                    data-effect="solid"
                    data-for={mainTooltipId}
                    data-place={'left'}
                    data-tip={mainTitle}
                    onClick={this.clickDelayerFactory(onClick)}
                >
                    <img
                        className={styles.icon}
                        draggable={false}
                        src={mainImg}
                    />
                </button>
                <ReactTooltip
                    className={classNames(styles.tooltip)}
                    id={mainTooltipId}
                    place="left"
                />
                <div className={styles.moreButtonsOuter}>
                    <div className={styles.moreButtons}>
                        {(moreButtons || []).map(({img, title, onClick: handleClick}) => {
                            const isComingSoon = !handleClick;
                            const tooltipId = `tooltip-${Math.random()}`;
                            return (
                                <div key={tooltipId}>
                                    <button
                                        className={classNames(styles.container, {
                                            [styles.comingSoon]: isComingSoon
                                        })}
                                        data-effect="solid"
                                        data-for={tooltipId}
                                        data-place={'left'}
                                        data-tip={title}
                                        // disabled={isComingSoon}
                                        onClick={this.clickDelayerFactory(handleClick)}
                                    >
                                        <img
                                            className={styles.icon}
                                            draggable={false}
                                            src={img}
                                        />
                                    </button>
                                    <ReactTooltip
                                        className={classNames(styles.tooltip, {
                                            [styles.comingSoonTooltip]: isComingSoon
                                        })}
                                        id={tooltipId}
                                        place="left"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

AssetButton.propTypes = {
    className: PropTypes.string,
    img: PropTypes.string,
    title: PropTypes.node.isRequired,
    moreButtons: PropTypes.arrayOf(PropTypes.shape({
        img: PropTypes.string,
        title: PropTypes.node.isRequired
    })),
    onClick: PropTypes.func.isRequired
};

export default AssetButton;
