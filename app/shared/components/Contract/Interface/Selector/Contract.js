// @flow
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';

import { Button, Form, Header, Segment } from 'semantic-ui-react';

class ContractInterfaceSelectorContract extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      contractName: props.contractName
    };
  }

  onChange = (e, { name, selection, value }) => {
    this.setState({ [name]: value }, () => {
      // If this is the dropdown, fire the submit
      if (selection) {
        this.onSubmit();
      }
    });
  };
  onSubmit = debounce(() => {
    const {
      onSet,
      onSubmit
    } = this.props;
    onSet(this.state, onSubmit);
  }, 300);
  render() {
    const {
      contract,
      onReset,
      system,
      t,
      settings
    } = this.props;
    const {
      contractName
    } = this.state;

    let recentOptions = [];
    if (settings && settings.recentContracts) {
      recentOptions = settings.recentContracts.map((recentContract) => ({
        text: recentContract,
        value: recentContract,
      }));
    }

    let display;
    const shouldDisplayContractInfo = contract && contract.account === contractName;
    if (shouldDisplayContractInfo) {
      display = (
        <Segment secondary stacked>
          <Button
            content={t('interface_contract_reset')}
            floated="right"
            onClick={onReset}
            primary
          />
          <Header style={{ marginTop: 0 }}>
            {t('interface_contract_loaded_header')}: {contractName}
            <Header.Subheader>
              {t('interface_contract_loaded_subheader')}
            </Header.Subheader>
          </Header>
        </Segment>
      );
    } else {
      display = (
        <Segment basic>
          <Form
            onSubmit={this.onSubmit}
          >
            <Header>
              {t('interface_header')}
              <Header.Subheader>
                {t('interface_subheader')}
              </Header.Subheader>
            </Header>
            <Form.Group inline widths="equal">
              <Form.Dropdown
                additionLabel=""
                allowAdditions
                autoFocus
                fluid
                label={t('interface_contract_account_name')}
                name="contractName"
                placeholder={t('interface_contract_account_name_placeholder')}
                onChange={this.onChange}
                openOnFocus={false}
                options={recentOptions}
                search
                searchInput={{ autoFocus: true }}
                selection
                selectOnBlur={false}
                selectOnNavigation={false}
              />
            </Form.Group>
            <Button
              content={t('interface_contract_load')}
              loading={system.GETABI === 'PENDING'}
              disabled={system.GETABI === 'PENDING'}
              primary
            />
          </Form>
        </Segment>
      );
    }
    return display;
  }
}

export default withTranslation('contract')(ContractInterfaceSelectorContract);
