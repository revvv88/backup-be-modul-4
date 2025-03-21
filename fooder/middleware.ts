import { NextResponse, NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  if (request.nextUrl.pathname === "/") {
    const redirectAdmin = request.nextUrl.clone();
    redirectAdmin.pathname = "/login";
    return NextResponse.redirect(redirectAdmin);
  }

  //   MANAGER
  // Cek apakah pengguna mencoba mengakses halaman manager
  if (request.nextUrl.pathname.startsWith("/manager")) {
    // Jika tidak ada token atau role, arahkan ke halaman login
    if (!token || !role) {
      const redirectAdmin = request.nextUrl.clone();
      redirectAdmin.pathname = "/login";
      return NextResponse.redirect(redirectAdmin);
    }

    // Jika role bukan MANAGER, arahkan ke halaman login
    if (role !== "MANAGER") {
      const redirectAdmin = request.nextUrl.clone();
      redirectAdmin.pathname = "/login";
      return NextResponse.redirect(redirectAdmin);
    }

    // CASHIER
    // Cek apakah pengguna mencoba mengakses halaman cashier
  } else if (request.nextUrl.pathname.startsWith("/cashier")) {
    // Jika tidak ada token atau role, arahkan ke halaman login
    if (!token || !role) {
      const redirectAdmin = request.nextUrl.clone();
      redirectAdmin.pathname = "/login";
      return NextResponse.redirect(redirectAdmin);
    }

    // Jika role bukan CASHIER, arahkan ke halaman login
    if (role !== "CASHIER") {
      const redirectAdmin = request.nextUrl.clone();
      redirectAdmin.pathname = "/login";
      return NextResponse.redirect(redirectAdmin);
    }
  }

  // Jika semua cek berhasil, lanjutkan ke halaman yang diminta
  return NextResponse.next();
};

export const config = {
  matcher: [
    "/manager/:path*", // Menangkap semua rute di bawah /manager
    "/cashier/:path*", // Menangkap semua rute di bawah /cashier
    "/", // Menangkap rute root
  ],
};
