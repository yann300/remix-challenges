pragma circom 2.0.0;

include "circomlib/poseidon.circom";

template CalculateHash() {
    signal input value1;
    signal input value2;
    signal input value3;
    signal input value4;
    signal output out;

    component poseidon = Poseidon(4);

    poseidon.inputs[0] <== value1;
    poseidon.inputs[1] <== value2;
    poseidon.inputs[2] <== value3;
    poseidon.inputs[3] <== value4;

    out <== poseidon.out;
}

template CalculateNullifierHash() {
    signal input externalNullifier;

    signal output out;

    component poseidon = Poseidon(1);

    poseidon.inputs[0] <== externalNullifier;

    out <== poseidon.out;
}

template HashChecker() {
    signal input value1;
    signal input value2;
    signal input value3;
    signal input value4;
    signal input hash;

    signal input externalNullifier;

    signal output nullifierHash;

    component calculateSecret = CalculateHash();
    calculateSecret.value1 <== value1;
    calculateSecret.value2 <== value2;
    calculateSecret.value3 <== value3;
    calculateSecret.value4 <== value4;

    signal calculatedHash;
    calculatedHash <== calculateSecret.out;

    component calculateNullifierHash = CalculateNullifierHash();
    calculateNullifierHash.externalNullifier <== externalNullifier;

    // prevent double signaling
    nullifierHash <== calculateNullifierHash.out;

    assert(hash == calculatedHash);
    
}

component main {public [hash, externalNullifier]} = HashChecker();