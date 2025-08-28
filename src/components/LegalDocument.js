import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import PrimaryLayout from './PrimaryLayout'

const LegalType = ({ subtitle, description, textCenter }) => {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const renderTextWithLinks = (text) => {
    const parts = [];
    let match;
    let lastIndex = 0;

    // Find URLs first
    while ((match = urlRegex.exec(text)) !== null) {
      const link = match[0].replace(')', ''); // Remove the ending ')'
      parts.push(text.slice(lastIndex, match.index)); // Push the text before the link
      parts.push(
        <TouchableOpacity
          key={match.index}
          onPress={() => Linking.openURL(link)}
          activeOpacity={0.7}
        >
          <Text style={{ color: "#6f27ff", textDecorationLine: 'underline' }}>
            {" "}{match[0]}
          </Text>
        </TouchableOpacity>
      );
      lastIndex = urlRegex.lastIndex;
    }

    parts.push(text.slice(lastIndex)); // Push the remaining text after the last match

    // Find and replace emails - process the original text to avoid splitting issues
    const emailMatch = text.match(emailRegex);
    if (emailMatch) {
      const email = emailMatch[0];
      const emailIndex = text.indexOf(email);

      // Clear existing parts and rebuild with proper email handling
      parts.length = 0;
      lastIndex = 0;

      // Re-add URL parts first
      const urlMatches = [];
      const urlRegex2 = /(https?:\/\/[^\s]+)/g;
      while ((match = urlRegex2.exec(text)) !== null) {
        urlMatches.push({ match: match[0], index: match.index });
      }

      // Sort matches by index
      urlMatches.sort((a, b) => a.index - b.index);

      // Rebuild parts with proper email and URL handling
      let currentIndex = 0;

      // Add text before first match
      if (urlMatches.length > 0) {
        parts.push(text.slice(currentIndex, urlMatches[0].index));
        currentIndex = urlMatches[0].index;
      }

      // Process each URL match
      urlMatches.forEach((urlMatch, index) => {
        const link = urlMatch.match.replace(')', '');
        parts.push(
          <TouchableOpacity
            key={`url-${index}`}
            onPress={() => Linking.openURL(link)}
            activeOpacity={0.7}
          >
            <Text style={{ color: "#6f27ff", textDecorationLine: 'underline' }}>
              {urlMatch.match}
            </Text>
          </TouchableOpacity>
        );

        // Add text between this URL and next URL (or email)
        const nextIndex = index < urlMatches.length - 1 ? urlMatches[index + 1].index : text.length;
        const textBetween = text.slice(urlMatch.match.length + urlMatch.index, nextIndex);

        if (textBetween.includes(email)) {
          // Split text around email
          const emailStart = textBetween.indexOf(email);
          parts.push(textBetween.slice(0, emailStart));
          parts.push(
            <TouchableOpacity
              key="email"
              onPress={() => Linking.openURL(`mailto:${email}`)}
              activeOpacity={0.7}
            >
              <Text style={{ color: "#6f27ff", textDecorationLine: 'underline' }}>
                {email}
              </Text>
            </TouchableOpacity>
          );
          parts.push(textBetween.slice(emailStart + email.length));
        } else {
          parts.push(textBetween);
        }

        currentIndex = nextIndex;
      });

      // If no URLs, handle email separately
      if (urlMatches.length === 0) {
        const emailStart = text.indexOf(email);
        parts.push(text.slice(0, emailStart));
        parts.push(
          <TouchableOpacity
            key="email"
            onPress={() => Linking.openURL(`mailto:${email}`)}
            activeOpacity={0.7}
          >
            <Text style={{ color: "#6f27ff", textDecorationLine: 'underline' }}>
              {email}
            </Text>
          </TouchableOpacity>
        );
        parts.push(text.slice(emailStart + email.length));
      }
    }

    return parts;
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{
        fontSize: 16,
        color: '#000000',
        fontFamily: 'instrument-sans-600',
        textAlign: textCenter ? 'center' : 'left'
      }}>
        {subtitle}
      </Text>
      {description?.map((data, index) => {
        const parts = renderTextWithLinks(data);

        return (
          <View key={index} style={{
            marginTop: 10,
            marginBottom: 8,
            alignItems: textCenter ? 'center' : 'flex-start'
          }}>
            <Text style={{
              fontSize: 14,
              color: 'rgb(102, 102, 102)',
              lineHeight: 20,
              fontFamily: 'instrument-sans-400',
              textAlign: textCenter ? 'center' : 'justify'
            }}>
              {parts}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const LegalList = ({ _subtitle, listItems, sub_title }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{
        fontSize: 16,
        color: '#000000',
        fontFamily: 'instrument-sans-600'
      }}>
        {_subtitle}
      </Text>
      {sub_title && (
        <Text style={{
          fontSize: 14,
          marginTop: 8,
          color: '#000000',
          fontFamily: 'instrument-sans-500'
        }}>
          {sub_title}
        </Text>
      )}
      {listItems?.map((data, index) => (
        <View key={index} style={{
          marginTop: 8,
          marginLeft: 16,
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}>
          <Icon
            name="arrow-forward-ios"
            size={10}
            color="rgb(102, 102, 102)"
            style={{ marginRight: 8, marginTop: 6, opacity: 0.7 }}
          />
          <Text style={{
            fontSize: 14,
            color: 'rgb(102, 102, 102)',
            flex: 1,
            lineHeight: 20,
            fontFamily: 'instrument-sans-400',
            textAlign: 'justify'
          }}>
            {data}
          </Text>
        </View>
      ))}
    </View>
  );
};

const LegalDocument = ({ data }) => {
  const { pageTitle, sections } = data;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <PrimaryLayout title={pageTitle} />
      <View style={{
        flex: 1, marginTop: -16,
        backgroundColor: '#F5F6F9',
        // borderTopLeftRadius: 16,
        // borderTopRightRadius: 16,
      }}>
        <View style={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 100
        }}>
          {sections.map((section, index) => {
            if (section?.isList) {
              return (
                <LegalList
                  key={index}
                  _subtitle={section?.title}
                  sub_title={section?.sub_title}
                  listItems={section?.items}
                />
              );
            } else {
              return (
                <LegalType
                  key={index}
                  subtitle={section?.title}
                  description={section?.description}
                  textCenter={false}
                />
              );
            }
          })}
          {/* Display current date in "Last updated: 19th August, 2025" format */}
          <Text
            style={{
              fontSize: 13,
              color: '#000000',
              opacity: 0.5,
              fontFamily: 'instrument-sans-400',
              marginBottom: 16,
            }}
          >
            {(() => {
              const date = new Date();
              const day = date.getDate();
              const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ];
              const month = monthNames[date.getMonth()];
              const year = date.getFullYear();

              // Helper to get ordinal suffix
              function ordinal(n) {
                if (n > 3 && n < 21) return n + 'th';
                switch (n % 10) {
                  case 1: return n + "st";
                  case 2: return n + "nd";
                  case 3: return n + "rd";
                  default: return n + "th";
                }
              }

              return `Last updated: ${ordinal(day)} ${month}, ${year}`;
            })()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default LegalDocument; 