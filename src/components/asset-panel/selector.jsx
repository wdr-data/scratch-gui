import PropTypes from 'prop-types';
import React from 'react';

import SpriteSelectorItem from '../../containers/sprite-selector-item.jsx';

import Box from '../box/box.jsx';
import AssetButton from '../asset-button/asset-button.jsx';
import styles from './selector.css';

const Selector = props => {
    const {
        buttons,
        items,
        selectedItemIndex,
        onDeleteClick,
        onItemClick
    } = props;

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.listArea}>
                {items.map((item, index) => (
                    <SpriteSelectorItem
                        assetId={item.assetId}
                        className={styles.listItem}
                        costumeURL={item.url}
                        id={index}
                        key={`asset-${index}`}
                        name={item.name}
                        selected={index === selectedItemIndex}
                        onClick={onItemClick}
                        onDeleteButtonClick={onDeleteClick}
                    />
                ))}
            </Box>
            <Box className={styles.newButtons}>
                {/* TODO clean up this API */}
                <AssetButton
                    img={buttons[0].img}
                    moreButtons={buttons.slice(1).map(button => ({
                        title: button.message,
                        img: button.img,
                        onClick: button.onClick
                    }))}
                    title={buttons[0].message}
                    onClick={buttons[0].onClick}
                />
            </Box>
        </Box>
    );
};

Selector.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.shape({
        message: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
    })),
    items: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        name: PropTypes.string.isRequired
    })),
    onDeleteClick: PropTypes.func,
    onItemClick: PropTypes.func.isRequired,
    selectedItemIndex: PropTypes.number.isRequired
};

export default Selector;
