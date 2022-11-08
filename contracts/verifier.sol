// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }


    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x12b783ec472296b3e196787e954387d9e02e5b4439ddd9ba16f568db37b1a7c5), uint256(0x0db7c0b7bdb26ea13d80844e0b02831b803a2307d6652bd07d9d3742d5c34ec2));
        vk.beta = Pairing.G2Point([uint256(0x1f5d53ce621a3785bf6536368772f0278cfb45582721469a50bbb6399523327d), uint256(0x0d2854548ff299c170710e70bb2b53796bc49fa56d3f7fb95e54086f44cb9efe)], [uint256(0x0bb1df5ef925c89685dceb6b587367252436213eb8b744473caf338914407b05), uint256(0x23857a918f085802d3493534cad2b7f828e6c4e3ff86f797e94f206590b6a39e)]);
        vk.gamma = Pairing.G2Point([uint256(0x1b4273a6bd1c397b7c7f91b89c694a6e8e47a1cd45c051560f3bce763a8406f4), uint256(0x2107548da4bef4e7134a57aafcef167d4aa3a42683c30f8dc5d94d887d4d35df)], [uint256(0x2dd10c93e9d06d687c8315bcdee5eac945319c7f455f3ac662c4617816fdd0f2), uint256(0x1a32c176f547ebb69b23382e3f43aec408e8369984aabb443414d5aefe3a7c2b)]);
        vk.delta = Pairing.G2Point([uint256(0x0484bda0e73efc404930b53b9f1c2a5386e4520b73a108e47d65c59b3bdba800), uint256(0x2cf1ee107598ccaddacf9f3f408c231a59e095a1711cd2a5f0d8ecb9f386fd61)], [uint256(0x0c95401f0b6e91ee8f4199f23af18d096def64ae65224505e79aeabc3c854477), uint256(0x1f384eb538bb0f87a17d4a1f5219c5068ee2033918eb2fc057f85fb1a9fd9c2e)]);
        vk.gamma_abc = new Pairing.G1Point[](4);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x0f205d8d8289661580725cbd25bb69e7aa65642afc8f13b2c10e2dc1bada1f60), uint256(0x2f54494a4a83912a10fc804f6ae004376aa4ea292ccbd337632adb237eb451e7));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x14217d1d6b88be38bffc57acfa84c662d1b0255fe5dcfe5ec5aa2b8d06bb5a4e), uint256(0x1e0fa9ba88f42dd36f7bb66c2030b71f072fd22301fcffe4a800a436b4d645ab));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x1f34398dfca7d618f26df1a80539fcd60e9ea74b0a0ba44c3acc1432b60d15d5), uint256(0x2585453e5deb470315941e98d673292ac71461cab5dfdb9c07097a20bb36d06d));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x2d0fb28082e342952dc5d819a320a705864ca7761414c4cb2011fd99525ec882), uint256(0x1f041a929def2c79af5e4e90779ea1ae3cbaeb7f2e072c005becc91d04858524));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            Proof memory proof, uint[3] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](3);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        inputValues[0] = 6441948221896607572742608488120559578;
        inputValues[1] = 146139290966201238425928859098213699460;
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
