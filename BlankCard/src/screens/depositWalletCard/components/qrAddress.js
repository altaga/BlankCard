import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import { ratio } from '../../../styles/styles';
import ContextModule from '../../../utils/contextModule';

export default class QrAddress extends Component {
  static contextType = ContextModule;
  render() {
    const publicKey = this.context.value.publicKeyCard;
    return (
      <QRCodeStyled
        maxSize={Dimensions.get('screen').width * (ratio > 1.7 ? 0.8 : 0.5)}
        data={publicKey}
        style={[
          {
            backgroundColor: 'white',
            borderRadius: 10,
          },
        ]}
        errorCorrectionLevel="H"
        padding={16}
        //pieceSize={10}
        pieceBorderRadius={4}
        isPiecesGlued
        color={'black'}
      />
    );
  }
}
