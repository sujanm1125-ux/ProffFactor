import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var InvoiceStatus;
(function (InvoiceStatus) {
  InvoiceStatus[InvoiceStatus['Proposed'] = 0] = 'Proposed';
  InvoiceStatus[InvoiceStatus['Accepted'] = 1] = 'Accepted';
  InvoiceStatus[InvoiceStatus['PendingFinancing'] = 2] = 'PendingFinancing';
  InvoiceStatus[InvoiceStatus['FinancedConfirmed'] = 3] = 'FinancedConfirmed';
  InvoiceStatus[InvoiceStatus['Paid'] = 4] = 'Paid';
  InvoiceStatus[InvoiceStatus['Rejected'] = 5] = 'Rejected';
  InvoiceStatus[InvoiceStatus['Cancelled'] = 6] = 'Cancelled';
})(InvoiceStatus || (InvoiceStatus = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeEnum(6, 1);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

class _InvoiceRecord_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment()))));
  }
  fromValue(value_0) {
    return {
      buyerIdentity: _descriptor_0.fromValue(value_0),
      supplierControlKey: _descriptor_0.fromValue(value_0),
      nullifier: _descriptor_0.fromValue(value_0),
      status: _descriptor_1.fromValue(value_0),
      policyId: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.buyerIdentity).concat(_descriptor_0.toValue(value_0.supplierControlKey).concat(_descriptor_0.toValue(value_0.nullifier).concat(_descriptor_1.toValue(value_0.status).concat(_descriptor_2.toValue(value_0.policyId)))));
  }
}

const _descriptor_3 = new _InvoiceRecord_0();

const _descriptor_4 = __compactRuntime.CompactTypeBoolean;

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _LenderPolicy_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_5.alignment().concat(_descriptor_6.alignment().concat(_descriptor_6.alignment().concat(_descriptor_6.alignment().concat(_descriptor_6.alignment().concat(_descriptor_4.alignment()))))));
  }
  fromValue(value_0) {
    return {
      lenderIdentity: _descriptor_0.fromValue(value_0),
      currencyCode: _descriptor_5.fromValue(value_0),
      minimumAmount: _descriptor_6.fromValue(value_0),
      maximumAmount: _descriptor_6.fromValue(value_0),
      latestInvoiceDueAt: _descriptor_6.fromValue(value_0),
      requestDeadline: _descriptor_6.fromValue(value_0),
      active: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.lenderIdentity).concat(_descriptor_5.toValue(value_0.currencyCode).concat(_descriptor_6.toValue(value_0.minimumAmount).concat(_descriptor_6.toValue(value_0.maximumAmount).concat(_descriptor_6.toValue(value_0.latestInvoiceDueAt).concat(_descriptor_6.toValue(value_0.requestDeadline).concat(_descriptor_4.toValue(value_0.active)))))));
  }
}

const _descriptor_7 = new _LenderPolicy_0();

class _InvoicePrivateData_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_5.alignment().concat(_descriptor_6.alignment().concat(_descriptor_0.alignment()))))));
  }
  fromValue(value_0) {
    return {
      invoiceReference: _descriptor_0.fromValue(value_0),
      supplierIdentity: _descriptor_0.fromValue(value_0),
      buyerIdentity: _descriptor_0.fromValue(value_0),
      amountMinor: _descriptor_6.fromValue(value_0),
      currencyCode: _descriptor_5.fromValue(value_0),
      dueAt: _descriptor_6.fromValue(value_0),
      salt: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.invoiceReference).concat(_descriptor_0.toValue(value_0.supplierIdentity).concat(_descriptor_0.toValue(value_0.buyerIdentity).concat(_descriptor_6.toValue(value_0.amountMinor).concat(_descriptor_5.toValue(value_0.currencyCode).concat(_descriptor_6.toValue(value_0.dueAt).concat(_descriptor_0.toValue(value_0.salt)))))));
  }
}

const _descriptor_8 = new _InvoicePrivateData_0();

class _AcceptanceWitness_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      invoiceReference: _descriptor_0.fromValue(value_0),
      buyerNullifierNonce: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.invoiceReference).concat(_descriptor_0.toValue(value_0.buyerNullifierNonce));
  }
}

const _descriptor_9 = new _AcceptanceWitness_0();

class _FinancingWitness_0 {
  alignment() {
    return _descriptor_8.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      invoice: _descriptor_8.fromValue(value_0),
      supplierControlSecret: _descriptor_0.fromValue(value_0),
      buyerNullifierNonce: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_8.toValue(value_0.invoice).concat(_descriptor_0.toValue(value_0.supplierControlSecret).concat(_descriptor_0.toValue(value_0.buyerNullifierNonce)));
  }
}

const _descriptor_10 = new _FinancingWitness_0();

const _descriptor_11 = new __compactRuntime.CompactTypeBytes(24);

class _tuple_0 {
  alignment() {
    return _descriptor_11.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment())));
  }
  fromValue(value_0) {
    return [
      _descriptor_11.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_0.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_11.toValue(value_0[0]).concat(_descriptor_0.toValue(value_0[1]).concat(_descriptor_0.toValue(value_0[2]).concat(_descriptor_0.toValue(value_0[3]))));
  }
}

const _descriptor_12 = new _tuple_0();

const _descriptor_13 = new __compactRuntime.CompactTypeBytes(31);

class _tuple_1 {
  alignment() {
    return _descriptor_13.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return [
      _descriptor_13.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_0.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_13.toValue(value_0[0]).concat(_descriptor_0.toValue(value_0[1]).concat(_descriptor_0.toValue(value_0[2])));
  }
}

const _descriptor_14 = new _tuple_1();

const _descriptor_15 = new __compactRuntime.CompactTypeBytes(21);

class _tuple_2 {
  alignment() {
    return _descriptor_15.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_15.fromValue(value_0),
      _descriptor_0.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_15.toValue(value_0[0]).concat(_descriptor_0.toValue(value_0[1]));
  }
}

const _descriptor_16 = new _tuple_2();

const _descriptor_17 = new __compactRuntime.CompactTypeBytes(22);

class _tuple_3 {
  alignment() {
    return _descriptor_17.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_6.alignment().concat(_descriptor_5.alignment().concat(_descriptor_6.alignment().concat(_descriptor_0.alignment())))))));
  }
  fromValue(value_0) {
    return [
      _descriptor_17.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_6.fromValue(value_0),
      _descriptor_5.fromValue(value_0),
      _descriptor_6.fromValue(value_0),
      _descriptor_0.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_17.toValue(value_0[0]).concat(_descriptor_0.toValue(value_0[1]).concat(_descriptor_0.toValue(value_0[2]).concat(_descriptor_0.toValue(value_0[3]).concat(_descriptor_6.toValue(value_0[4]).concat(_descriptor_5.toValue(value_0[5]).concat(_descriptor_6.toValue(value_0[6]).concat(_descriptor_0.toValue(value_0[7]))))))));
  }
}

const _descriptor_18 = new _tuple_3();

const _descriptor_19 = new __compactRuntime.CompactTypeBytes(20);

class _tuple_4 {
  alignment() {
    return _descriptor_19.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return [
      _descriptor_19.fromValue(value_0),
      _descriptor_0.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_19.toValue(value_0[0]).concat(_descriptor_0.toValue(value_0[1]));
  }
}

const _descriptor_20 = new _tuple_4();

class _Either_0 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_4.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_21 = new _Either_0();

const _descriptor_22 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_23 = new _ContractAddress_0();

const _descriptor_24 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.getRoleSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getRoleSecret');
    }
    if (typeof(witnesses_0.getFinancingWitness) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getFinancingWitness');
    }
    if (typeof(witnesses_0.getAcceptanceWitness) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getAcceptanceWitness');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      deriveAdminIdentity(context, ...args_1) {
        return { result: pureCircuits.deriveAdminIdentity(...args_1), context };
      },
      deriveBuyerIdentity(context, ...args_1) {
        return { result: pureCircuits.deriveBuyerIdentity(...args_1), context };
      },
      deriveLenderIdentity(context, ...args_1) {
        return { result: pureCircuits.deriveLenderIdentity(...args_1), context };
      },
      deriveInvoiceCommitment(context, ...args_1) {
        return { result: pureCircuits.deriveInvoiceCommitment(...args_1), context };
      },
      deriveInvoiceNullifier(context, ...args_1) {
        return { result: pureCircuits.deriveInvoiceNullifier(...args_1), context };
      },
      deriveSupplierControlKey(context, ...args_1) {
        return { result: pureCircuits.deriveSupplierControlKey(...args_1), context };
      },
      authorizeBuyer: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`authorizeBuyer: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const identity_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('authorizeBuyer',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 142 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(identity_0.buffer instanceof ArrayBuffer && identity_0.BYTES_PER_ELEMENT === 1 && identity_0.length === 32)) {
          __compactRuntime.typeError('authorizeBuyer',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 142 char 1',
                                     'Bytes<32>',
                                     identity_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(identity_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._authorizeBuyer_0(context,
                                                partialProofData,
                                                identity_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revokeBuyer: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`revokeBuyer: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const identity_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revokeBuyer',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 147 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(identity_0.buffer instanceof ArrayBuffer && identity_0.BYTES_PER_ELEMENT === 1 && identity_0.length === 32)) {
          __compactRuntime.typeError('revokeBuyer',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 147 char 1',
                                     'Bytes<32>',
                                     identity_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(identity_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revokeBuyer_0(context,
                                             partialProofData,
                                             identity_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      authorizeLender: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`authorizeLender: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const identity_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('authorizeLender',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 152 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(identity_0.buffer instanceof ArrayBuffer && identity_0.BYTES_PER_ELEMENT === 1 && identity_0.length === 32)) {
          __compactRuntime.typeError('authorizeLender',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 152 char 1',
                                     'Bytes<32>',
                                     identity_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(identity_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._authorizeLender_0(context,
                                                 partialProofData,
                                                 identity_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revokeLender: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`revokeLender: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const identity_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revokeLender',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 157 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(identity_0.buffer instanceof ArrayBuffer && identity_0.BYTES_PER_ELEMENT === 1 && identity_0.length === 32)) {
          __compactRuntime.typeError('revokeLender',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 157 char 1',
                                     'Bytes<32>',
                                     identity_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(identity_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revokeLender_0(context,
                                              partialProofData,
                                              identity_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      registerInvoiceCommitment: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`registerInvoiceCommitment: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        const buyerIdentity_0 = args_1[2];
        const supplierControlKey_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('registerInvoiceCommitment',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 162 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('registerInvoiceCommitment',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 162 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        if (!(buyerIdentity_0.buffer instanceof ArrayBuffer && buyerIdentity_0.BYTES_PER_ELEMENT === 1 && buyerIdentity_0.length === 32)) {
          __compactRuntime.typeError('registerInvoiceCommitment',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'prooffactor.compact line 162 char 1',
                                     'Bytes<32>',
                                     buyerIdentity_0)
        }
        if (!(supplierControlKey_0.buffer instanceof ArrayBuffer && supplierControlKey_0.BYTES_PER_ELEMENT === 1 && supplierControlKey_0.length === 32)) {
          __compactRuntime.typeError('registerInvoiceCommitment',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'prooffactor.compact line 162 char 1',
                                     'Bytes<32>',
                                     supplierControlKey_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitment_0).concat(_descriptor_0.toValue(buyerIdentity_0).concat(_descriptor_0.toValue(supplierControlKey_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._registerInvoiceCommitment_0(context,
                                                           partialProofData,
                                                           commitment_0,
                                                           buyerIdentity_0,
                                                           supplierControlKey_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      acceptInvoice: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`acceptInvoice: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('acceptInvoice',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 181 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('acceptInvoice',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 181 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitment_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._acceptInvoice_0(context,
                                               partialProofData,
                                               commitment_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      rejectInvoice: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`rejectInvoice: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('rejectInvoice',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 208 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('rejectInvoice',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 208 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitment_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._rejectInvoice_0(context,
                                               partialProofData,
                                               commitment_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      registerPolicy: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`registerPolicy: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const policyId_0 = args_1[1];
        const policy_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('registerPolicy',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 224 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(policyId_0) === 'bigint' && policyId_0 >= 0n && policyId_0 <= 4294967295n)) {
          __compactRuntime.typeError('registerPolicy',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 224 char 1',
                                     'Uint<0..4294967296>',
                                     policyId_0)
        }
        if (!(typeof(policy_0) === 'object' && policy_0.lenderIdentity.buffer instanceof ArrayBuffer && policy_0.lenderIdentity.BYTES_PER_ELEMENT === 1 && policy_0.lenderIdentity.length === 32 && typeof(policy_0.currencyCode) === 'bigint' && policy_0.currencyCode >= 0n && policy_0.currencyCode <= 65535n && typeof(policy_0.minimumAmount) === 'bigint' && policy_0.minimumAmount >= 0n && policy_0.minimumAmount <= 18446744073709551615n && typeof(policy_0.maximumAmount) === 'bigint' && policy_0.maximumAmount >= 0n && policy_0.maximumAmount <= 18446744073709551615n && typeof(policy_0.latestInvoiceDueAt) === 'bigint' && policy_0.latestInvoiceDueAt >= 0n && policy_0.latestInvoiceDueAt <= 18446744073709551615n && typeof(policy_0.requestDeadline) === 'bigint' && policy_0.requestDeadline >= 0n && policy_0.requestDeadline <= 18446744073709551615n && typeof(policy_0.active) === 'boolean')) {
          __compactRuntime.typeError('registerPolicy',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'prooffactor.compact line 224 char 1',
                                     'struct LenderPolicy<lenderIdentity: Bytes<32>, currencyCode: Uint<0..65536>, minimumAmount: Uint<0..18446744073709551616>, maximumAmount: Uint<0..18446744073709551616>, latestInvoiceDueAt: Uint<0..18446744073709551616>, requestDeadline: Uint<0..18446744073709551616>, active: Boolean>',
                                     policy_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(policyId_0).concat(_descriptor_7.toValue(policy_0)),
            alignment: _descriptor_2.alignment().concat(_descriptor_7.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._registerPolicy_0(context,
                                                partialProofData,
                                                policyId_0,
                                                policy_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      requestFinancing: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`requestFinancing: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        const policyId_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('requestFinancing',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 234 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('requestFinancing',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 234 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        if (!(typeof(policyId_0) === 'bigint' && policyId_0 >= 0n && policyId_0 <= 4294967295n)) {
          __compactRuntime.typeError('requestFinancing',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'prooffactor.compact line 234 char 1',
                                     'Uint<0..4294967296>',
                                     policyId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitment_0).concat(_descriptor_2.toValue(policyId_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_2.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._requestFinancing_0(context,
                                                  partialProofData,
                                                  commitment_0,
                                                  policyId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      confirmFinancing: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`confirmFinancing: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('confirmFinancing',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 278 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('confirmFinancing',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 278 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitment_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._confirmFinancing_0(context,
                                                  partialProofData,
                                                  commitment_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      declineFinancing: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`declineFinancing: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('declineFinancing',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 300 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('declineFinancing',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 300 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitment_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._declineFinancing_0(context,
                                                  partialProofData,
                                                  commitment_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      releaseExpiredRequest: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`releaseExpiredRequest: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('releaseExpiredRequest',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 317 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('releaseExpiredRequest',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 317 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitment_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._releaseExpiredRequest_0(context,
                                                       partialProofData,
                                                       commitment_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      markInvoicePaid: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`markInvoicePaid: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('markInvoicePaid',
                                     'argument 1 (as invoked from Typescript)',
                                     'prooffactor.compact line 334 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.typeError('markInvoicePaid',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'prooffactor.compact line 334 char 1',
                                     'Bytes<32>',
                                     commitment_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(commitment_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._markInvoicePaid_0(context,
                                                 partialProofData,
                                                 commitment_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      authorizeBuyer: this.circuits.authorizeBuyer,
      revokeBuyer: this.circuits.revokeBuyer,
      authorizeLender: this.circuits.authorizeLender,
      revokeLender: this.circuits.revokeLender,
      registerInvoiceCommitment: this.circuits.registerInvoiceCommitment,
      acceptInvoice: this.circuits.acceptInvoice,
      rejectInvoice: this.circuits.rejectInvoice,
      registerPolicy: this.circuits.registerPolicy,
      requestFinancing: this.circuits.requestFinancing,
      confirmFinancing: this.circuits.confirmFinancing,
      declineFinancing: this.circuits.declineFinancing,
      releaseExpiredRequest: this.circuits.releaseExpiredRequest,
      markInvoicePaid: this.circuits.markInvoicePaid
    };
    this.provableCircuits = {
      authorizeBuyer: this.circuits.authorizeBuyer,
      revokeBuyer: this.circuits.revokeBuyer,
      authorizeLender: this.circuits.authorizeLender,
      revokeLender: this.circuits.revokeLender,
      registerInvoiceCommitment: this.circuits.registerInvoiceCommitment,
      acceptInvoice: this.circuits.acceptInvoice,
      rejectInvoice: this.circuits.rejectInvoice,
      registerPolicy: this.circuits.registerPolicy,
      requestFinancing: this.circuits.requestFinancing,
      confirmFinancing: this.circuits.confirmFinancing,
      declineFinancing: this.circuits.declineFinancing,
      releaseExpiredRequest: this.circuits.releaseExpiredRequest,
      markInvoicePaid: this.circuits.markInvoicePaid
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('authorizeBuyer', new __compactRuntime.ContractOperation());
    state_0.setOperation('revokeBuyer', new __compactRuntime.ContractOperation());
    state_0.setOperation('authorizeLender', new __compactRuntime.ContractOperation());
    state_0.setOperation('revokeLender', new __compactRuntime.ContractOperation());
    state_0.setOperation('registerInvoiceCommitment', new __compactRuntime.ContractOperation());
    state_0.setOperation('acceptInvoice', new __compactRuntime.ContractOperation());
    state_0.setOperation('rejectInvoice', new __compactRuntime.ContractOperation());
    state_0.setOperation('registerPolicy', new __compactRuntime.ContractOperation());
    state_0.setOperation('requestFinancing', new __compactRuntime.ContractOperation());
    state_0.setOperation('confirmFinancing', new __compactRuntime.ContractOperation());
    state_0.setOperation('declineFinancing', new __compactRuntime.ContractOperation());
    state_0.setOperation('releaseExpiredRequest', new __compactRuntime.ContractOperation());
    state_0.setOperation('markInvoicePaid', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(0n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(1n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(2n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(3n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(4n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(5n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._deriveAdminIdentity_0(this._getRoleSecret_0(context,
                                                                    partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_24.toValue(0n),
                                                                                              alignment: _descriptor_24.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _blockTimeLt_0(context, partialProofData, time_0) {
    return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_24.toValue(2n),
                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(time_0),
                                                                                                                             alignment: _descriptor_6.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _blockTimeGte_0(context, partialProofData, time_0) {
    return !this._blockTimeLt_0(context, partialProofData, time_0);
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_20, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_16, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_18, value_0);
    return result_0;
  }
  _persistentHash_3(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_12, value_0);
    return result_0;
  }
  _persistentHash_4(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_14, value_0);
    return result_0;
  }
  _getRoleSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getRoleSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('getRoleSecret',
                                 'return value',
                                 'prooffactor.compact line 60 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _getFinancingWitness_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getFinancingWitness(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.invoice) === 'object' && result_0.invoice.invoiceReference.buffer instanceof ArrayBuffer && result_0.invoice.invoiceReference.BYTES_PER_ELEMENT === 1 && result_0.invoice.invoiceReference.length === 32 && result_0.invoice.supplierIdentity.buffer instanceof ArrayBuffer && result_0.invoice.supplierIdentity.BYTES_PER_ELEMENT === 1 && result_0.invoice.supplierIdentity.length === 32 && result_0.invoice.buyerIdentity.buffer instanceof ArrayBuffer && result_0.invoice.buyerIdentity.BYTES_PER_ELEMENT === 1 && result_0.invoice.buyerIdentity.length === 32 && typeof(result_0.invoice.amountMinor) === 'bigint' && result_0.invoice.amountMinor >= 0n && result_0.invoice.amountMinor <= 18446744073709551615n && typeof(result_0.invoice.currencyCode) === 'bigint' && result_0.invoice.currencyCode >= 0n && result_0.invoice.currencyCode <= 65535n && typeof(result_0.invoice.dueAt) === 'bigint' && result_0.invoice.dueAt >= 0n && result_0.invoice.dueAt <= 18446744073709551615n && result_0.invoice.salt.buffer instanceof ArrayBuffer && result_0.invoice.salt.BYTES_PER_ELEMENT === 1 && result_0.invoice.salt.length === 32 && result_0.supplierControlSecret.buffer instanceof ArrayBuffer && result_0.supplierControlSecret.BYTES_PER_ELEMENT === 1 && result_0.supplierControlSecret.length === 32 && result_0.buyerNullifierNonce.buffer instanceof ArrayBuffer && result_0.buyerNullifierNonce.BYTES_PER_ELEMENT === 1 && result_0.buyerNullifierNonce.length === 32)) {
      __compactRuntime.typeError('getFinancingWitness',
                                 'return value',
                                 'prooffactor.compact line 61 char 1',
                                 'struct FinancingWitness<invoice: struct InvoicePrivateData<invoiceReference: Bytes<32>, supplierIdentity: Bytes<32>, buyerIdentity: Bytes<32>, amountMinor: Uint<0..18446744073709551616>, currencyCode: Uint<0..65536>, dueAt: Uint<0..18446744073709551616>, salt: Bytes<32>>, supplierControlSecret: Bytes<32>, buyerNullifierNonce: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_10.toValue(result_0),
      alignment: _descriptor_10.alignment()
    });
    return result_0;
  }
  _getAcceptanceWitness_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getAcceptanceWitness(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && result_0.invoiceReference.buffer instanceof ArrayBuffer && result_0.invoiceReference.BYTES_PER_ELEMENT === 1 && result_0.invoiceReference.length === 32 && result_0.buyerNullifierNonce.buffer instanceof ArrayBuffer && result_0.buyerNullifierNonce.BYTES_PER_ELEMENT === 1 && result_0.buyerNullifierNonce.length === 32)) {
      __compactRuntime.typeError('getAcceptanceWitness',
                                 'return value',
                                 'prooffactor.compact line 62 char 1',
                                 'struct AcceptanceWitness<invoiceReference: Bytes<32>, buyerNullifierNonce: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_9.toValue(result_0),
      alignment: _descriptor_9.alignment()
    });
    return result_0;
  }
  _deriveAdminIdentity_0(secret_0) {
    return this._persistentHash_0([new Uint8Array([112, 114, 111, 111, 102, 102, 97, 99, 116, 111, 114, 58, 97, 100, 109, 105, 110, 58, 118, 49]),
                                   secret_0]);
  }
  _deriveBuyerIdentity_0(secret_0) {
    return this._persistentHash_0([new Uint8Array([112, 114, 111, 111, 102, 102, 97, 99, 116, 111, 114, 58, 98, 117, 121, 101, 114, 58, 118, 49]),
                                   secret_0]);
  }
  _deriveLenderIdentity_0(secret_0) {
    return this._persistentHash_1([new Uint8Array([112, 114, 111, 111, 102, 102, 97, 99, 116, 111, 114, 58, 108, 101, 110, 100, 101, 114, 58, 118, 49]),
                                   secret_0]);
  }
  _deriveInvoiceCommitment_0(data_0) {
    return this._persistentHash_2([new Uint8Array([112, 114, 111, 111, 102, 102, 97, 99, 116, 111, 114, 58, 105, 110, 118, 111, 105, 99, 101, 58, 118, 49]),
                                   data_0.invoiceReference,
                                   data_0.supplierIdentity,
                                   data_0.buyerIdentity,
                                   data_0.amountMinor,
                                   data_0.currencyCode,
                                   data_0.dueAt,
                                   data_0.salt]);
  }
  _deriveInvoiceNullifier_0(buyerIdentity_0, invoiceReference_0, nonce_0) {
    return this._persistentHash_3([new Uint8Array([112, 114, 111, 111, 102, 102, 97, 99, 116, 111, 114, 58, 110, 117, 108, 108, 105, 102, 105, 101, 114, 58, 118, 49]),
                                   buyerIdentity_0,
                                   invoiceReference_0,
                                   nonce_0]);
  }
  _deriveSupplierControlKey_0(commitment_0, secret_0) {
    return this._persistentHash_4([new Uint8Array([112, 114, 111, 111, 102, 102, 97, 99, 116, 111, 114, 58, 115, 117, 112, 112, 108, 105, 101, 114, 45, 99, 111, 110, 116, 114, 111, 108, 58, 118, 49]),
                                   commitment_0,
                                   secret_0]);
  }
  _authorizeBuyer_0(context, partialProofData, identity_0) {
    this._requireAdmin_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(1n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(identity_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _revokeBuyer_0(context, partialProofData, identity_0) {
    this._requireAdmin_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(1n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(identity_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _authorizeLender_0(context, partialProofData, identity_0) {
    this._requireAdmin_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(2n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(identity_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _revokeLender_0(context, partialProofData, identity_0) {
    this._requireAdmin_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(2n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(identity_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _registerInvoiceCommitment_0(context,
                               partialProofData,
                               commitment_0,
                               buyerIdentity_0,
                               supplierControlKey_0)
  {
    const publicCommitment_0 = commitment_0;
    const publicBuyer_0 = buyerIdentity_0;
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_24.toValue(3n),
                                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Invoice commitment already registered');
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(1n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicBuyer_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Buyer identity is not authorized');
    const tmp_0 = { buyerIdentity: publicBuyer_0,
                    supplierControlKey: supplierControlKey_0,
                    nullifier: new Uint8Array(32),
                    status: 0,
                    policyId: 0n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(3n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _acceptInvoice_0(context, partialProofData, commitment_0) {
    const publicCommitment_0 = commitment_0;
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(3n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Invoice commitment is not registered');
    const existing_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_24.toValue(3n),
                                                                                                             alignment: _descriptor_24.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                             alignment: _descriptor_0.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    __compactRuntime.assert(existing_0.status === 0, 'Invoice is not proposed');
    const buyerIdentity_0 = this._deriveBuyerIdentity_0(this._getRoleSecret_0(context,
                                                                              partialProofData));
    __compactRuntime.assert(this._equal_0(existing_0.buyerIdentity,
                                          buyerIdentity_0),
                            'Only the authorized buyer can accept');
    const acceptance_0 = this._getAcceptanceWitness_0(context, partialProofData);
    __compactRuntime.assert(!this._equal_1(acceptance_0.invoiceReference,
                                           new Uint8Array(32)),
                            'Invoice reference is required');
    __compactRuntime.assert(!this._equal_2(acceptance_0.buyerNullifierNonce,
                                           new Uint8Array(32)),
                            'Buyer nullifier nonce is required');
    const nullifier_0 = this._deriveInvoiceNullifier_0(buyerIdentity_0,
                                                       acceptance_0.invoiceReference,
                                                       acceptance_0.buyerNullifierNonce);
    const tmp_0 = { buyerIdentity: existing_0.buyerIdentity,
                    supplierControlKey: existing_0.supplierControlKey,
                    nullifier: nullifier_0,
                    status: 1,
                    policyId: 0n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(3n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _rejectInvoice_0(context, partialProofData, commitment_0) {
    const publicCommitment_0 = commitment_0;
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(3n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Invoice commitment is not registered');
    const existing_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_24.toValue(3n),
                                                                                                             alignment: _descriptor_24.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                             alignment: _descriptor_0.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    __compactRuntime.assert(existing_0.status === 0, 'Invoice is not proposed');
    __compactRuntime.assert(this._equal_3(existing_0.buyerIdentity,
                                          this._deriveBuyerIdentity_0(this._getRoleSecret_0(context,
                                                                                            partialProofData))),
                            'Only the authorized buyer can reject');
    const tmp_0 = { buyerIdentity: existing_0.buyerIdentity,
                    supplierControlKey: existing_0.supplierControlKey,
                    nullifier: existing_0.nullifier,
                    status: 5,
                    policyId: 0n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(3n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _registerPolicy_0(context, partialProofData, policyId_0, policy_0) {
    const lender_0 = this._deriveLenderIdentity_0(this._getRoleSecret_0(context,
                                                                        partialProofData));
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(2n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(lender_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Lender identity is not authorized');
    __compactRuntime.assert(this._equal_4(lender_0, policy_0.lenderIdentity),
                            'Policy lender does not match caller');
    let t_0;
    __compactRuntime.assert((t_0 = policy_0.minimumAmount, t_0 > 0n),
                            'Policy minimum must be positive');
    let t_1;
    __compactRuntime.assert((t_1 = policy_0.minimumAmount,
                             t_1 <= policy_0.maximumAmount),
                            'Policy amount range is invalid');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_24.toValue(4n),
                                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(policyId_0),
                                                                                                                                               alignment: _descriptor_2.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Policy version already exists');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(4n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(policyId_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(policy_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _requestFinancing_0(context, partialProofData, commitment_0, policyId_0) {
    const publicCommitment_0 = commitment_0;
    const publicPolicyId_0 = policyId_0;
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(3n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Invoice commitment is not registered');
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(4n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(publicPolicyId_0),
                                                                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Lender policy does not exist');
    const existing_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_24.toValue(3n),
                                                                                                             alignment: _descriptor_24.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                             alignment: _descriptor_0.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    const policy_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_24.toValue(4n),
                                                                                                           alignment: _descriptor_24.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(publicPolicyId_0),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const financingProof_0 = this._getFinancingWitness_0(context,
                                                         partialProofData);
    __compactRuntime.assert(existing_0.status === 1, 'Invoice is not accepted');
    __compactRuntime.assert(policy_0.active, 'Lender policy is inactive');
    __compactRuntime.assert(this._equal_5(this._deriveInvoiceCommitment_0(financingProof_0.invoice),
                                          commitment_0),
                            'Private invoice does not open commitment');
    __compactRuntime.assert(this._equal_6(this._deriveSupplierControlKey_0(commitment_0,
                                                                           financingProof_0.supplierControlSecret),
                                          existing_0.supplierControlKey),
                            'Supplier control secret is invalid');
    const expectedNullifier_0 = this._deriveInvoiceNullifier_0(financingProof_0.invoice.buyerIdentity,
                                                               financingProof_0.invoice.invoiceReference,
                                                               financingProof_0.buyerNullifierNonce);
    __compactRuntime.assert(this._equal_7(expectedNullifier_0,
                                          existing_0.nullifier),
                            'Buyer nullifier opening is invalid');
    __compactRuntime.assert(!_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_24.toValue(5n),
                                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(expectedNullifier_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Invoice was already financed');
    __compactRuntime.assert(this._equal_8(financingProof_0.invoice.currencyCode,
                                          policy_0.currencyCode),
                            'Invoice currency does not match policy');
    let t_0;
    __compactRuntime.assert((t_0 = financingProof_0.invoice.amountMinor,
                             t_0 >= policy_0.minimumAmount),
                            'Invoice amount is below policy minimum');
    let t_1;
    __compactRuntime.assert((t_1 = financingProof_0.invoice.amountMinor,
                             t_1 <= policy_0.maximumAmount),
                            'Invoice amount exceeds policy maximum');
    let t_2;
    __compactRuntime.assert((t_2 = financingProof_0.invoice.dueAt,
                             t_2 <= policy_0.latestInvoiceDueAt),
                            'Invoice due date exceeds policy limit');
    __compactRuntime.assert(this._blockTimeLt_0(context,
                                                partialProofData,
                                                financingProof_0.invoice.dueAt),
                            'Invoice is expired');
    __compactRuntime.assert(this._blockTimeLt_0(context,
                                                partialProofData,
                                                policy_0.requestDeadline),
                            'Policy request window is closed');
    const tmp_0 = { buyerIdentity: existing_0.buyerIdentity,
                    supplierControlKey: existing_0.supplierControlKey,
                    nullifier: existing_0.nullifier,
                    status: 2,
                    policyId: policyId_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(3n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _confirmFinancing_0(context, partialProofData, commitment_0) {
    const publicCommitment_0 = commitment_0;
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(3n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Invoice commitment is not registered');
    const existing_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_24.toValue(3n),
                                                                                                             alignment: _descriptor_24.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                             alignment: _descriptor_0.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    __compactRuntime.assert(existing_0.status === 2,
                            'No pending financing request');
    let tmp_0;
    __compactRuntime.assert((tmp_0 = existing_0.policyId,
                             _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_24.toValue(4n),
                                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_0),
                                                                                                                                               alignment: _descriptor_2.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value)),
                            'Pending lender policy does not exist');
    let tmp_1;
    const policy_0 = (tmp_1 = existing_0.policyId,
                      _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_24.toValue(4n),
                                                                                                            alignment: _descriptor_24.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(tmp_1),
                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value));
    __compactRuntime.assert(this._equal_9(policy_0.lenderIdentity,
                                          this._deriveLenderIdentity_0(this._getRoleSecret_0(context,
                                                                                             partialProofData))),
                            'Only the selected lender can confirm');
    let tmp_2;
    __compactRuntime.assert(!(tmp_2 = existing_0.nullifier,
                              _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_24.toValue(5n),
                                                                                                                    alignment: _descriptor_24.alignment() } }] } },
                                                                                         { push: { storage: false,
                                                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                                                                         'member',
                                                                                         { popeq: { cached: true,
                                                                                                    result: undefined } }]).value)),
                            'Invoice was already financed');
    __compactRuntime.assert(this._blockTimeLt_0(context,
                                                partialProofData,
                                                policy_0.requestDeadline),
                            'Pending financing request expired');
    const tmp_3 = existing_0.nullifier;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(5n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_3),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_4 = { buyerIdentity: existing_0.buyerIdentity,
                    supplierControlKey: existing_0.supplierControlKey,
                    nullifier: existing_0.nullifier,
                    status: 3,
                    policyId: existing_0.policyId };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(3n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_4),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _declineFinancing_0(context, partialProofData, commitment_0) {
    const publicCommitment_0 = commitment_0;
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(3n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Invoice commitment is not registered');
    const existing_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_24.toValue(3n),
                                                                                                             alignment: _descriptor_24.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                             alignment: _descriptor_0.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    __compactRuntime.assert(existing_0.status === 2,
                            'No pending financing request');
    let tmp_0;
    const policy_0 = (tmp_0 = existing_0.policyId,
                      _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_24.toValue(4n),
                                                                                                            alignment: _descriptor_24.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(tmp_0),
                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value));
    __compactRuntime.assert(this._equal_10(policy_0.lenderIdentity,
                                           this._deriveLenderIdentity_0(this._getRoleSecret_0(context,
                                                                                              partialProofData))),
                            'Only the selected lender can decline');
    const tmp_1 = { buyerIdentity: existing_0.buyerIdentity,
                    supplierControlKey: existing_0.supplierControlKey,
                    nullifier: existing_0.nullifier,
                    status: 1,
                    policyId: 0n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(3n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_1),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _releaseExpiredRequest_0(context, partialProofData, commitment_0) {
    const publicCommitment_0 = commitment_0;
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(3n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Invoice commitment is not registered');
    const existing_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_24.toValue(3n),
                                                                                                             alignment: _descriptor_24.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                             alignment: _descriptor_0.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    __compactRuntime.assert(existing_0.status === 2,
                            'No pending financing request');
    let tmp_0;
    const policy_0 = (tmp_0 = existing_0.policyId,
                      _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_24.toValue(4n),
                                                                                                            alignment: _descriptor_24.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(tmp_0),
                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value));
    __compactRuntime.assert(this._blockTimeGte_0(context,
                                                 partialProofData,
                                                 policy_0.requestDeadline),
                            'Pending financing request has not expired');
    const tmp_1 = { buyerIdentity: existing_0.buyerIdentity,
                    supplierControlKey: existing_0.supplierControlKey,
                    nullifier: existing_0.nullifier,
                    status: 1,
                    policyId: 0n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(3n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_1),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _markInvoicePaid_0(context, partialProofData, commitment_0) {
    const publicCommitment_0 = commitment_0;
    __compactRuntime.assert(_descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_24.toValue(3n),
                                                                                                                  alignment: _descriptor_24.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Invoice commitment is not registered');
    const existing_0 = _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_24.toValue(3n),
                                                                                                             alignment: _descriptor_24.alignment() } }] } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_0.toValue(publicCommitment_0),
                                                                                                             alignment: _descriptor_0.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value);
    __compactRuntime.assert(this._equal_11(existing_0.buyerIdentity,
                                           this._deriveBuyerIdentity_0(this._getRoleSecret_0(context,
                                                                                             partialProofData))),
                            'Only the authorized buyer can mark paid');
    __compactRuntime.assert(existing_0.status === 1 || existing_0.status === 2
                            ||
                            existing_0.status === 3,
                            'Invoice cannot be marked paid from its current state');
    const tmp_0 = { buyerIdentity: existing_0.buyerIdentity,
                    supplierControlKey: existing_0.supplierControlKey,
                    nullifier: existing_0.nullifier,
                    status: 4,
                    policyId: existing_0.policyId };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_24.toValue(3n),
                                                                  alignment: _descriptor_24.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(publicCommitment_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _requireAdmin_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_12(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_24.toValue(0n),
                                                                                                                                 alignment: _descriptor_24.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value),
                                           this._deriveAdminIdentity_0(this._getRoleSecret_0(context,
                                                                                             partialProofData))),
                            'Only the contract admin can perform this action');
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_9(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_10(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_11(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_12(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get contractAdmin() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_24.toValue(0n),
                                                                                                   alignment: _descriptor_24.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    authorizedBuyers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(1n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(0n),
                                                                                                                                 alignment: _descriptor_6.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(1n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'prooffactor.compact line 65 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(1n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    authorizedLenders: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(2n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(0n),
                                                                                                                                 alignment: _descriptor_6.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(2n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'prooffactor.compact line 66 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(2n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    invoices: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(3n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(0n),
                                                                                                                                 alignment: _descriptor_6.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(3n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'prooffactor.compact line 67 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(3n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'prooffactor.compact line 67 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(3n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    policies: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(4n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(0n),
                                                                                                                                 alignment: _descriptor_6.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(4n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'prooffactor.compact line 68 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(4n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(key_0),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'prooffactor.compact line 68 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(4n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(key_0),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_2.fromValue(key.value),      _descriptor_7.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    consumedNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(5n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(0n),
                                                                                                                                 alignment: _descriptor_6.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(5n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'prooffactor.compact line 69 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_24.toValue(5n),
                                                                                                     alignment: _descriptor_24.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  getRoleSecret: (...args) => undefined,
  getFinancingWitness: (...args) => undefined,
  getAcceptanceWitness: (...args) => undefined
});
export const pureCircuits = {
  deriveAdminIdentity: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveAdminIdentity: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveAdminIdentity',
                                 'argument 1',
                                 'prooffactor.compact line 75 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._deriveAdminIdentity_0(secret_0);
  },
  deriveBuyerIdentity: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveBuyerIdentity: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveBuyerIdentity',
                                 'argument 1',
                                 'prooffactor.compact line 82 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._deriveBuyerIdentity_0(secret_0);
  },
  deriveLenderIdentity: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveLenderIdentity: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const secret_0 = args_0[0];
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveLenderIdentity',
                                 'argument 1',
                                 'prooffactor.compact line 89 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._deriveLenderIdentity_0(secret_0);
  },
  deriveInvoiceCommitment: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveInvoiceCommitment: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const data_0 = args_0[0];
    if (!(typeof(data_0) === 'object' && data_0.invoiceReference.buffer instanceof ArrayBuffer && data_0.invoiceReference.BYTES_PER_ELEMENT === 1 && data_0.invoiceReference.length === 32 && data_0.supplierIdentity.buffer instanceof ArrayBuffer && data_0.supplierIdentity.BYTES_PER_ELEMENT === 1 && data_0.supplierIdentity.length === 32 && data_0.buyerIdentity.buffer instanceof ArrayBuffer && data_0.buyerIdentity.BYTES_PER_ELEMENT === 1 && data_0.buyerIdentity.length === 32 && typeof(data_0.amountMinor) === 'bigint' && data_0.amountMinor >= 0n && data_0.amountMinor <= 18446744073709551615n && typeof(data_0.currencyCode) === 'bigint' && data_0.currencyCode >= 0n && data_0.currencyCode <= 65535n && typeof(data_0.dueAt) === 'bigint' && data_0.dueAt >= 0n && data_0.dueAt <= 18446744073709551615n && data_0.salt.buffer instanceof ArrayBuffer && data_0.salt.BYTES_PER_ELEMENT === 1 && data_0.salt.length === 32)) {
      __compactRuntime.typeError('deriveInvoiceCommitment',
                                 'argument 1',
                                 'prooffactor.compact line 96 char 1',
                                 'struct InvoicePrivateData<invoiceReference: Bytes<32>, supplierIdentity: Bytes<32>, buyerIdentity: Bytes<32>, amountMinor: Uint<0..18446744073709551616>, currencyCode: Uint<0..65536>, dueAt: Uint<0..18446744073709551616>, salt: Bytes<32>>',
                                 data_0)
    }
    return _dummyContract._deriveInvoiceCommitment_0(data_0);
  },
  deriveInvoiceNullifier: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`deriveInvoiceNullifier: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const buyerIdentity_0 = args_0[0];
    const invoiceReference_0 = args_0[1];
    const nonce_0 = args_0[2];
    if (!(buyerIdentity_0.buffer instanceof ArrayBuffer && buyerIdentity_0.BYTES_PER_ELEMENT === 1 && buyerIdentity_0.length === 32)) {
      __compactRuntime.typeError('deriveInvoiceNullifier',
                                 'argument 1',
                                 'prooffactor.compact line 118 char 1',
                                 'Bytes<32>',
                                 buyerIdentity_0)
    }
    if (!(invoiceReference_0.buffer instanceof ArrayBuffer && invoiceReference_0.BYTES_PER_ELEMENT === 1 && invoiceReference_0.length === 32)) {
      __compactRuntime.typeError('deriveInvoiceNullifier',
                                 'argument 2',
                                 'prooffactor.compact line 118 char 1',
                                 'Bytes<32>',
                                 invoiceReference_0)
    }
    if (!(nonce_0.buffer instanceof ArrayBuffer && nonce_0.BYTES_PER_ELEMENT === 1 && nonce_0.length === 32)) {
      __compactRuntime.typeError('deriveInvoiceNullifier',
                                 'argument 3',
                                 'prooffactor.compact line 118 char 1',
                                 'Bytes<32>',
                                 nonce_0)
    }
    return _dummyContract._deriveInvoiceNullifier_0(buyerIdentity_0,
                                                    invoiceReference_0,
                                                    nonce_0);
  },
  deriveSupplierControlKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`deriveSupplierControlKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const commitment_0 = args_0[0];
    const secret_0 = args_0[1];
    if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
      __compactRuntime.typeError('deriveSupplierControlKey',
                                 'argument 1',
                                 'prooffactor.compact line 131 char 1',
                                 'Bytes<32>',
                                 commitment_0)
    }
    if (!(secret_0.buffer instanceof ArrayBuffer && secret_0.BYTES_PER_ELEMENT === 1 && secret_0.length === 32)) {
      __compactRuntime.typeError('deriveSupplierControlKey',
                                 'argument 2',
                                 'prooffactor.compact line 131 char 1',
                                 'Bytes<32>',
                                 secret_0)
    }
    return _dummyContract._deriveSupplierControlKey_0(commitment_0, secret_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
