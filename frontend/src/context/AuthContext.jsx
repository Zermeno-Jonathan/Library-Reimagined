import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRole = async (authUser) => {
        if (!authUser) {
            setUserRole(null);
            return;
        }

        const { data } = await supabase
            .from('users')
            .select('rol')
            .eq('auth_id', authUser.id)
            .single();

        setUserRole(data?.rol ?? null);
    };

    useEffect(() => {
        // Sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            const authUser = session?.user ?? null;
            setUser(authUser);
            fetchRole(authUser).finally(() => setLoading(false));
        });

        // Escucha cambios de sesión
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const authUser = session?.user ?? null;
            setUser(authUser);
            fetchRole(authUser);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('userRole');
        setUser(null);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, userRole, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
