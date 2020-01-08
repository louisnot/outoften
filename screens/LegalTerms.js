import React from 'react';
import {View, Text, StyleSheet, SafeAreaView,ScrollView} from 'react-native';

export default class Privacy extends React.Component{
    constructor(props){
        super(props)

    }
    render(){
        return(
            <SafeAreaView>
                <ScrollView>
                    <Text style={{fontSize:30, fontWeight:'bold',textAlign:'center'}}>End-User License Agreement (EULA) of Out of Ten</Text>
                    <Text style={{fontSize:20,fontWeight:'bold',color:'grey',fontStyle:'italic'}}>LAST UPDATE : JANUARY  2020</Text>
                    <Text style={{fontSize:22, fontWeight:'bold',textAlign:'center'}}>PLEASE BE SURE TO READ THOSE TERMS CAREFULLY BEFORE USING OUT OF TEN APPLICATION </Text>
                    <Text style={{textAlign:'center'}}>
                        This End-User License Agreement ("EULA") is a legal agreement between you and Notte App

                        This EULA agreement governs your acquisition and use of our Out of Ten software ("Software") directly from Notte App or indirectly through a Notte App authorized reseller or distributor (a "Reseller").

                        Please read this EULA agreement carefully before completing the installation process and using the Out of Ten software. It provides a license to use the Out of Ten software and contains warranty information and liability disclaimers.

                        If you register for a free trial of the Out of Ten software, this EULA agreement will also govern that trial. By clicking "accept" or installing and/or using the Out of Ten software, you are confirming your acceptance of the Software and agreeing to become bound by the terms of this EULA agreement.

                        If you are entering into this EULA agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions. If you do not have such authority or if you do not agree with the terms and conditions of this EULA agreement, do not install or use the Software, and you must not accept this EULA agreement.

                        This EULA agreement shall apply only to the Software supplied by Notte App herewith regardless of whether other software is referred to or described herein. The terms also apply to any Notte App updates, supplements, Internet-based services, and support services for the Software, unless other terms accompany those items on delivery. If so, those terms apply. This EULA was created by EULA Template for Out of Ten.

                        License Grant
                        Notte App hereby grants you a personal, non-transferable, non-exclusive licence to use the Out of Ten software on your devices in accordance with the terms of this EULA agreement.

                        You are permitted to load the Out of Ten software (for example a PC, laptop, mobile or tablet) under your control. You are responsible for ensuring your device meets the minimum requirements of the Out of Ten software.

                        You are not permitted to:

                        Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the Software nor permit the whole or any part of the Software to be combined with or become incorporated in any other software, nor decompile, disassemble or reverse engineer the Software or attempt to do any such things
                        Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose
                        Allow any third party to use the Software on behalf of or for the benefit of any third party
                        Use the Software in any way which breaches any applicable local, national or international law
                        use the Software for any purpose that Notte App considers is a breach of this EULA agreement
                        Intellectual Property and Ownership
                        Notte App shall at all times retain ownership of the Software as originally downloaded by you and all subsequent downloads of the Software by you. The Software (and the copyright, and other intellectual property rights of whatever nature in the Software, including any modifications made thereto) are and shall remain the property of Notte App.

                        Notte App reserves the right to grant licences to use the Software to third parties.

                        Termination
                        This EULA agreement is effective from the date you first use the Software and shall continue until terminated. You may terminate it at any time upon written notice to Notte App.

                        It will also terminate immediately if you fail to comply with any term of this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will immediately terminate and you agree to stop all access and use of the Software. The provisions that by their nature continue and survive will survive any termination of this EULA agreement.

                        Governing Law
                        This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of France.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        )
    }
}


const style = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent:'center'
    }
})