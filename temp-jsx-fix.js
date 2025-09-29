// Temporary fix for the JSX structure
// This will replace the end of the WhatsApp page

// Close the conversations tab content properly
        )}
        </div>
      )}

      {activeTab === 'bot' && (
        <BotConfiguration />
      )}

      {activeTab === 'users' && (
        <UserManagement />
      )}
    </div>
  )
}