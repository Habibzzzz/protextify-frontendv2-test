# Session Troubleshooting Guide

## Masalah: User Data Mixing di Production

### Deskripsi Masalah
Ketika user A login di browser A, kemudian user B login di browser B, tapi browser B menampilkan data user A.

### Penyebab
1. **Session Management**: localStorage tidak terisolasi antar browser/device
2. **Caching Issues**: Browser cache data user yang lama
3. **Production vs Development**: Environment production memiliki karakteristik berbeda

### Solusi yang Diterapkan

#### 1. Session Isolation
- ✅ Unique Session ID untuk setiap login
- ✅ Session validation yang ketat
- ✅ Automatic cleanup saat logout

#### 2. Cache Busting
- ✅ Production cache busting
- ✅ Force refresh mechanism
- ✅ Service worker cache clearing

#### 3. Data Consistency
- ✅ User data validation
- ✅ Session consistency checks
- ✅ Automatic logout pada inconsistency

### Cara Testing

#### Manual Testing
1. Login dengan user A di browser A
2. Login dengan user B di browser B
3. Verify bahwa browser B menampilkan data user B
4. Check console untuk session debug info

#### Debug Commands (Development)
```javascript
// Check session info
window.debugSession()

// Check for conflicts
window.checkSessionConflicts()

// Force clear all data
window.forceClearAllData()

// Check session manager
window.sessionManager.getSessionInfo()
```

### Monitoring di Production

#### Console Logs to Watch
- "Session inconsistency detected"
- "User data mismatch detected"
- "No valid session found"

#### Key Metrics
- Session ID consistency
- User data validation
- Cache clearing success

### Rollback Plan
Jika ada masalah dengan implementasi ini:

1. **Immediate**: Revert ke versi sebelumnya
2. **Quick Fix**: Disable session validation sementara
3. **Long Term**: Implementasi server-side session management

### Files Modified
- `src/services/auth.js` - Session management
- `src/contexts/AuthContext.jsx` - Auth state management
- `src/utils/sessionManager.js` - Session utilities
- `src/utils/debugSession.js` - Debug utilities
- `src/utils/constants.js` - Cache busting config

### Testing Checklist
- [ ] Login user A di browser A
- [ ] Login user B di browser B  
- [ ] Verify user B shows user B data
- [ ] Test logout functionality
- [ ] Test session persistence
- [ ] Test cache clearing
- [ ] Test production deployment

### Notes
- Session ID format: `session_{timestamp}_{random}`
- Cache busting enabled in production only
- Force reload on logout untuk clear cached state
- Session validation pada setiap API call
