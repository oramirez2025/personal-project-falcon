# Test Data Guide for User Profile

## Creating Test Data

Run this command to generate test user with profile and ticket purchases:

```bash
cd server
python manage.py create_test_data
```

## Test User Credentials

- **Email:** test@example.com
- **Password:** password123

## What Gets Created

1. **Test User**
   - First Name: John
   - Last Name: Doe
   - Email: test@example.com

2. **User Profile**
   - Bio: "Fantasy enthusiast and forge master. Ready for the ultimate medieval experience!"
   - Phone: 555-123-4567
   - Profile Picture: None (you can test upload via UI)

3. **Ticket Templates** (if not already exist)
   - General Admission - $250
   - Community Ticket - $400
   - Master Upgrade - $600

4. **Test Orders** (3 different purchase dates)
   - **Order 1** (7 days ago): 2x General Admission ($500)
   - **Order 2** (3 days ago): 1x Community Ticket ($400)
   - **Order 3** (1 day ago): 1x General Admission + 1x Master Upgrade ($850)

## Testing the Profile Page

1. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd server
   python manage.py runserver

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

2. Visit http://localhost:5173 and log in with test credentials

3. Navigate to `/profile` to see:
   - User info with initials avatar
   - All purchased tickets displayed
   - Upload button for profile picture

## About Ticket History

### Current Implementation
- **All paid orders** are displayed as "Active Tickets"
- No history section yet

### Why?
- FalconForge is a single upcoming event
- All tickets are considered "active" until the event passes

### Future Enhancement
To add history functionality, you could:

1. Add an event date field to tickets
2. Filter orders by date:
   ```javascript
   const eventDate = new Date('2026-06-15'); // Example event date
   const now = new Date();

   const activeOrders = orders.filter(order =>
     new Date(order.created_at) < eventDate && eventDate > now
   );

   const historyOrders = orders.filter(order =>
     eventDate <= now
   );
   ```

3. Or add a "used" flag to track when tickets are scanned at the event

## Clearing Test Data

To remove test data and start fresh:

```bash
# Delete the test user (cascades to orders and profile)
python manage.py shell
>>> from user_app.models import MyUsers
>>> MyUsers.objects.filter(email='test@example.com').delete()
>>> exit()

# Then run create_test_data again
python manage.py create_test_data
```

## Customizing Test Data

Edit `/server/user_app/management/commands/create_test_data.py` to:
- Change user info (name, email, bio)
- Add more orders
- Modify ticket quantities
- Adjust purchase dates
