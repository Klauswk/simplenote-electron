import React, { Component } from 'react';
import { connect } from 'react-redux';
import FocusTrap from 'focus-trap-react';

import ConnectionStatus from '../connection-status';
import NavigationBarItem from './item';
import TagList from '../tag-list';
import NotesIcon from '../icons/notes';
import TrashIcon from '../icons/trash';
import SettingsIcon from '../icons/settings';
import { viewExternalUrl } from '../utils/url-utils';
import actions from '../state/actions';

import * as S from '../state';
import * as T from '../types';

type StateProps = {
  autoHideMenuBar: boolean;
  collection: T.Collection;
  isDialogOpen: boolean;
  showNavigation: boolean;
};

type DispatchProps = {
  onAbout: () => any;
  onFocusTrapDeactivate: () => any;
  onSettings: () => any;
  onShowAllNotes: () => any;
  selectTrash: () => any;
  showKeyboardShortcuts: () => any;
};

type Props = StateProps & DispatchProps;

export class NavigationBar extends Component<Props> {
  static displayName = 'NavigationBar';
  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleFocusTrapDeactivate = () => {
    const { isDialogOpen, onFocusTrapDeactivate, showNavigation } = this.props;

    if (isDialogOpen) {
      return;
    }

    // isMounted prevents reopening sidebar after navigation event
    if (showNavigation && this.isMounted) {
      onFocusTrapDeactivate();
    }
  };

  onHelpClicked = () => viewExternalUrl('http://simplenote.com/help');

  onSelectTrash = () => {
    this.props.selectTrash();
  };

  // Determine if the selected class should be applied for the 'all notes' or 'trash' rows
  isSelected = ({
    selectedRow,
  }: {
    selectedRow: 'all' | 'trash' | 'untagged';
  }) => {
    return this.props.collection.type === selectedRow;
  };

  render() {
    const {
      autoHideMenuBar,
      isDialogOpen,
      onAbout,
      onSettings,
      onShowAllNotes,
    } = this.props;
    return (
      <FocusTrap
        active={!isDialogOpen}
        focusTrapOptions={{
          onDeactivate: this.handleFocusTrapDeactivate,
          clickOutsideDeactivates: true,
        }}
      >
        <div className="navigation-bar theme-color-bg theme-color-fg theme-color-border">
          <div className="navigation-bar__folders theme-color-border">
            <NavigationBarItem
              icon={<NotesIcon />}
              isSelected={this.isSelected({ selectedRow: 'all' })}
              label="All Notes"
              onClick={onShowAllNotes}
            />
            <NavigationBarItem
              icon={<TrashIcon />}
              isSelected={this.isSelected({ selectedRow: 'trash' })}
              label="Trash"
              onClick={this.onSelectTrash}
            />
            <NavigationBarItem
              icon={<SettingsIcon />}
              label="Settings"
              onClick={onSettings}
            />
          </div>
          <div className="navigation-bar__tags theme-color-border">
            <TagList />
          </div>
          <div className="navigation-bar__tools theme-color-border">
            <div className="navigation-bar__server-connection">
              <ConnectionStatus />
            </div>
          </div>
          <div className="navigation-bar__footer">
            <button
              type="button"
              className="navigation-bar__footer-item theme-color-fg-dim"
              onClick={this.props.showKeyboardShortcuts}
            >
              Keyboard Shortcuts
            </button>
          </div>
          <div className="navigation-bar__footer">
            <button
              type="button"
              className="navigation-bar__footer-item theme-color-fg-dim"
              onClick={this.onHelpClicked}
            >
              Help &amp; Support
            </button>
            <button
              type="button"
              className="navigation-bar__footer-item theme-color-fg-dim"
              onClick={onAbout}
            >
              About
            </button>
          </div>
        </div>
      </FocusTrap>
    );
  }
}

const mapStateToProps: S.MapState<StateProps> = ({
  settings,
  ui: { collection, dialogs, showNavigation },
}) => ({
  autoHideMenuBar: settings.autoHideMenuBar,
  collection,
  isDialogOpen: dialogs.length > 0,
  showNavigation,
});

const mapDispatchToProps: S.MapDispatch<DispatchProps> = {
  onAbout: () => actions.ui.showDialog('ABOUT'),
  onFocusTrapDeactivate: actions.ui.toggleNavigation,
  onShowAllNotes: actions.ui.showAllNotes,
  onSettings: () => actions.ui.showDialog('SETTINGS'),
  selectTrash: actions.ui.selectTrash,
  showKeyboardShortcuts: () => actions.ui.showDialog('KEYBINDINGS'),
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
