/**
 * UrlWidget component.
 * @module components/manage/Widgets/UrlWidget
 */

import React, { useState } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import {
  addAppURL,
  isInternalURL,
  flattenToAppURL,
} from '@plone/volto/helpers';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import clearSVG from '@plone/volto/icons/clear.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import URLUtils from '@plone/volto/components/manage/AnchorPlugin/utils/URLUtils';

/** UrlWidget function component
 * @function UrlWidget
 * @returns {string} Markup of the component
 */
const UrlWidget = (props) => {
  const { id, onChange, onBlur, onClick, minLength, maxLength } = props;
  const inputId = `field-${id}`;

  const [value, setValue] = useState(flattenToAppURL(props.value));
  const [isInvalid, setIsInvalid] = useState(false);
  /**
   * Clear handler
   * @method clear
   * @param {Object} value Value
   * @returns {undefined}
   */
  const clear = () => {
    setValue('');
    onChange(id, undefined);
  };

  const onChangeValue = (_value) => {
    let newValue = _value;
    if (newValue?.length > 0) {
      if (isInvalid && URLUtils.isUrl(URLUtils.normalizeUrl(newValue))) {
        setIsInvalid(false);
      }

      if (isInternalURL(newValue)) {
        newValue = flattenToAppURL(newValue);
      }
    }

    setValue(newValue);

    newValue = isInternalURL(newValue) ? addAppURL(newValue) : newValue;

    if (!isInternalURL(newValue) && newValue.length > 0) {
      if (URLUtils.isMail(URLUtils.normaliseMail(newValue))) {
        newValue = URLUtils.normaliseMail(newValue);
      } else if (URLUtils.isTelephone(newValue)) {
        newValue = URLUtils.normalizeTelephone(newValue);
      } else {
        newValue = URLUtils.normalizeUrl(newValue);
        if (!URLUtils.isUrl(newValue)) {
          setIsInvalid(true);
        }
      }
    }

    onChange(id, newValue === '' ? undefined : newValue);
  };

  return (
    <FormFieldWrapper {...props} className="url wide">
      <div className="wrapper">
        <Input
          id={inputId}
          name={id}
          type="url"
          value={value || ''}
          onChange={({ target }) => onChangeValue(target.value)}
          onBlur={({ target }) =>
            onBlur(id, target.value === '' ? undefined : target.value)
          }
          onClick={() => onClick()}
          minLength={minLength || null}
          maxLength={maxLength || null}
          error={isInvalid}
        />
        {value?.length > 0 ? (
          <Button.Group>
            <Button
              basic
              className="cancel"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clear();
              }}
            >
              <Icon name={clearSVG} size="30px" />
            </Button>
          </Button.Group>
        ) : (
          <Button.Group>
            <Button
              basic
              icon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.openObjectBrowser({
                  mode: 'link',
                  overlay: true,
                  onSelectItem: (url) => {
                    onChangeValue(url);
                  },
                });
              }}
            >
              <Icon name={navTreeSVG} size="24px" />
            </Button>
          </Button.Group>
        )}
      </div>
    </FormFieldWrapper>
  );
};

/**
 * Property types
 * @property {Object} propTypes Property types.
 * @static
 */
UrlWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  openObjectBrowser: PropTypes.func.isRequired,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
UrlWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: null,
  onChange: () => {},
  onBlur: () => {},
  onClick: () => {},
  minLength: null,
  maxLength: null,
};

export default compose(withObjectBrowser)(UrlWidget);
