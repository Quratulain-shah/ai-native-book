import React from 'react';
import clsx from 'clsx';
import OriginalAdmonition from '@theme-original/Admonition';
import styles from './styles.module.css';

const Admonition = (props) => {
  // Determine the type of admonition for custom styling
  const type = props.type || 'note';
  const customTitle = props.title || '';

  // Custom titles based on type
  const getCustomTitle = () => {
    switch(type) {
      case 'note':
        return 'SYSTEM NOTE';
      case 'tip':
        return 'OPERATION TIP';
      case 'caution':
        return 'CAUTION';
      case 'danger':
        return 'CRITICAL ERROR';
      case 'info':
        return 'INFORMATION';
      default:
        return customTitle || props.title;
    }
  };

  // Apply custom styling based on type
  const customProps = {
    ...props,
    title: getCustomTitle(),
    className: clsx(
      props.className,
      styles.hudAdmonition,
      styles[`hudAdmonition--${type}`]
    )
  };

  return (
    <div className={styles.hudContainer}>
      <OriginalAdmonition {...customProps} />
    </div>
  );
};

export default Admonition;