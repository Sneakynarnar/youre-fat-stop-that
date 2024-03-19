/**
 * Authenticates the google ID token.
 * @param {obj} IDToken 
 */
export async function googleAuth(IDToken) {
  try {
    const ticket = await client.verifyIdToken({
      IDToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];
    res.status(200).json({ userId });
  } catch (error) {
    console.error('Error verifying Google token:', error.message);
    res.status(401).json({ error: 'We had trouble authenticating your google account.' }); 
  }
}