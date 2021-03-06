import React from 'react';
import { shallow } from 'enzyme';
import {
  ViolationRuleLink,
  ViolationPointer,
  ViolationPaths,
  Violations,
  Violation,
  ViolationsResult,
} from '../violations.jsx';

describe('ViolationRuleLink component', () => {
  test('should return a rule link', () => {
    const component = shallow(<ViolationRuleLink ruleLink="foo" />);
    const link = component.find('a');

    expect(link).toHaveLength(1);
    expect(link.text()).toEqual('foo');
  });
});

describe('ViolationPointer component', () => {
  test('should return the pointer', () => {
    const pointer = '/pointer/1';
    const component = shallow(<ViolationPointer pointer={pointer} />);
    const p = component.find('p');

    expect(p.text()).toEqual('Pointer: /pointer/1');
  });
});

describe('ViolationPaths component', () => {
  test('should return list of paths', () => {
    const paths = ['#/definitions/Pet', '#/foo/bar'];
    const component = shallow(<ViolationPaths paths={paths} />);
    const li = component.find('li');

    expect(li).toHaveLength(2);
  });
});

describe('Violations component', () => {
  test('should return list of violation', () => {
    const violations = [{}, {}];
    const component = shallow(<Violations violations={violations} />);
    expect(component.find('h3')).toHaveLength(1);
    expect(component.find('Violation')).toHaveLength(violations.length);
  });

  test('should render empty list of violation', () => {
    const component = shallow(<Violations violations={[]} />);
    expect(component.find('Violation')).toHaveLength(0);
    expect(component.find('h3')).toHaveLength(0);
  });
});

describe('Violation component', () => {
  test('should render a violation', () => {
    const violation = {
      rule: {
        name: 'NoUnusedDefinitionsRule',
        title: 'Do not leave unused definitions',
        violationType: 'SHOULD',
        url: '',
        code: 'S005',
      },
      title: 'Do not leave unused definitions',
      description: 'Found 1 unused definitions',
      violation_type: 'SHOULD',
      rule_link: 'link',
      paths: ['#/definitions/Pet'],
    };

    const component = shallow(<Violation violation={violation} />);
    const IfViolationRuleLinkSelector =
      'If[dataTestId="if-violation-rule-link"]';
    const IfViolationRuleLink = component.find(IfViolationRuleLinkSelector);
    const ViolationRuleLink = IfViolationRuleLink.dive().find(
      'ViolationRuleLink'
    );
    const IfViolationPathsSelector = 'If[dataTestId="if-violation-paths"]';
    const IfViolationPaths = component.find(IfViolationPathsSelector);
    const ViolationPaths = IfViolationPaths.dive().find('ViolationPaths');

    expect(component.find('p').text()).toEqual('Found 1 unused definitions');
    expect(component.find('RuleType')).toHaveLength(1);
    expect(ViolationRuleLink).toHaveLength(1);
    expect(ViolationRuleLink.prop('ruleLink')).toEqual('link');
    expect(ViolationPaths).toHaveLength(1);
    expect(ViolationPaths.prop('paths')).toEqual(violation.paths);
  });
});

describe('ViolationsResult component', () => {
  describe('when state is pending', () => {
    test('should render loading spinner', () => {
      const component = shallow(
        <ViolationsResult
          pending={true}
          complete={false}
          errorMsgText={null}
          violations={[]}
          successMsgTitle="Good Job!"
          successMsgText="No violations found in the analyzed schema."
        />
      );

      expect(
        component
          .find('If[dataTestId="if-loading"]')
          .dive()
          .find('.dc-spinner--small')
      ).toHaveLength(1);
    });
  });

  describe('when state is complete with no violations', () => {
    test('should render well done message', () => {
      const component = shallow(
        <ViolationsResult
          pending={false}
          complete={true}
          errorMsgText={null}
          violations={[]}
          successMsgTitle="Good Job!"
          successMsgText="No violations found in the analyzed schema."
        />
      );

      const IfSuccessSelector = 'If[dataTestId="if-success"]';
      const IfSuccess = component.find(IfSuccessSelector);
      const Msg = IfSuccess.dive().find('Msg');

      expect(Msg).toHaveLength(1);
      expect(Msg.prop('type')).toEqual('success');
      expect(Msg.prop('title')).toEqual('Good Job!');
      expect(Msg.prop('text')).toEqual(
        'No violations found in the analyzed schema.'
      );
    });
  });

  describe('when state is complete with errors', () => {
    test('should render error  message', () => {
      const component = shallow(
        <ViolationsResult
          pending={false}
          complete={true}
          errorMsgText={'Server Error'}
          violations={[]}
          successMsgTitle=""
          successMsgText=""
        />
      );

      const IfErrorSelector = 'If[dataTestId="if-error"]';
      const IfError = component.find(IfErrorSelector);
      const Msg = IfError.dive().find('Msg');

      expect(Msg).toHaveLength(1);
      expect(Msg.prop('type')).toEqual('error');
      expect(Msg.prop('title')).toEqual('ERROR');
      expect(Msg.prop('text')).toEqual('Server Error');
    });
  });

  describe('when state is complete with violations', () => {
    test('should render violations', () => {
      const violations = [{}, {}];
      const component = shallow(
        <ViolationsResult
          pending={false}
          complete={true}
          errorMsgText={null}
          violations={violations}
          violationsCount={2}
          successMsgTitle=""
          successMsgText=""
        />
      );

      const IfViolationsSelector = 'If[dataTestId="if-violations"]';
      const IfViolations = component.find(IfViolationsSelector);
      const Violations = IfViolations.dive().find('Violations');

      expect(Violations).toHaveLength(1);
      expect(Violations.prop('violations')).toEqual(violations);
      expect(Violations.prop('violationsCount')).toEqual(2);
    });
  });
});
