import Header from "../components/common/Header";
import NotificationsTable from "../components/nofitication/NotificationsTable";

const NotificationsPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Notifications' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* CRUD USERS */}
                <NotificationsTable />

            </main>
        </div>
    );
}

export default NotificationsPage